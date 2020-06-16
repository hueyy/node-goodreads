import axios, { AxiosRequestConfig } from 'axios'
import OAuth from 'oauth'
import xml2js from 'xml2js'
import qs from 'query-string'

interface authoriseResult {
  oauthToken: string,
  oauthSecret: string,
  url: string,
}

class Goodreads {
  endpoint = `https://www.goodreads.com`
  req = axios.create({
    baseURL: this.endpoint,
  })
  key: string
  secret: string
  callback: string
  oauthToken: string
  oauthSecret: string

  constructor({
    key,
    secret,
    callback = `http://localhost:8000/callback`
  }) {
    this.req.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        key,
      }
      return config
    })

    this.req.interceptors.response.use(async res => {
      res.data = await xml2js.parseStringPromise(res.data)
      return res
    })

    this.key = key
    this.secret = secret
    this.callback = callback
  }

  showUser = async (username) => {
    try {
      const { data } = await this.req.get(`/user/show/${username}.xml`)
      return data.GoodreadsResponse.user[0]
    } catch (error) {
      throw error
    }
  }

  getOauth = () => (
    new OAuth.OAuth(
      `https://goodreads.com/oauth/request_token`,
      `https://goodreads.com/oauth/access_token`,
      this.key,
      this.secret,
      `1.0A`,
      this.callback,
      `HMAC-SHA1`,
      null,
      null
    ) as any
  )


  authoriseUser = (): Promise<authoriseResult> => {
    const oauth = this.getOauth()
    return new Promise((resolve, reject) => {
      oauth.getOAuthRequestToken((error, oauthToken, oauthSecret) => {
        if (error) {
          console.error(error)
          reject(error)
        } else {
          const params = {
            oauth_token: oauthToken,
            oauth_callback: this.callback
          }
          resolve({
            oauthToken,
            oauthSecret,
            url: `${this.endpoint}/oauth/authorize?${qs.stringify(params)}`
          })
        }
      })
    })
  }

  configureOauth = (oauthToken, oauthSecret) => {
    this.oauthToken = oauthToken
    this.oauthSecret = oauthSecret
  }

  oauthRequest = (path) => {
    const oauth = this.getOauth()
    return new Promise((resolve, reject) => {
      oauth.get(
        `${this.endpoint}${path}`,
        this.oauthToken,
        this.oauthSecret,
        async (error, data, response) => {
          if (error) {
            reject(error)
          } else {
            resolve(await xml2js.parseStringPromise(data))
          }
        }
      )
    })
  }

  reviewsList = async (username, shelf = `currently-reading`, sort = `title`, search?, order?, page?) => {
    const params = {
      v: 2,
      id: username,
      shelf,
      sort,
      search,
      order,
      page,
      key: this.key,
    }
    const path = `/review/list?${qs.stringify(params)}`

    if (this.oauthToken && this.oauthSecret) {
      const data = await this.oauthRequest(path)
      return data
    } else {
      const { data } = await this.req.get(path)
      return data.GoodreadsResponse.reviews
    }
  }
}

export default (config) => new Goodreads(config)