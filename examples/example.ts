import inquirer from 'inquirer'
import fs from 'fs'
import Goodreads from '../src/goodreads'

const METHODS = {
  showUser: `showUser`,
  authorise: `authorise`,
  reviewsList: `reviewsList`
}

const main = async () => {
  const {
    GOODREADS_API_KEY,
    GOODREADS_API_SECRET
  } = process.env

  const stateFile = `state.cache`
  let state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(`state.cache`, `utf-8`)) : {}

  const writeToState = (update) => {
    state = {
      ...state,
      ...update
    }
    fs.writeFileSync(stateFile, JSON.stringify(state))
  }

  const gr = Goodreads({ key: GOODREADS_API_KEY, secret: GOODREADS_API_SECRET })

  const methodsPrompt = [
    {
      type: `list`,
      name: `method`,
      message: `Which method do you want to run? Press Ctrl-C to exit.`,
      choices: Object.values(METHODS)
    }
  ]
  const {
    method
  } = await inquirer.prompt(methodsPrompt)

  if (method === METHODS.showUser) {

    const { username } = await inquirer.prompt([{
      type: `input`,
      name: `username`,
      message: `Goodreads username`,
      default: `52535740` // Blake Crouch
    }])
    const user = await gr.showUser(username)
    console.log(JSON.stringify(user))

  } else if (method === METHODS.authorise) {

    const result = await gr.authoriseUser()
    console.log(JSON.stringify(result))
    const { oauthToken, oauthSecret } = result
    writeToState({
      oauthToken,
      oauthSecret
    })

  } else if (method === METHODS.reviewsList) {

    const { oauthToken, oauthSecret } = state
    if (oauthToken && oauthSecret) {
      gr.configureOauth(oauthToken, oauthSecret)
    }

    const { username } = await inquirer.prompt([{
      type: `input`,
      name: `username`,
      message: `Goodreads username`,
      default: `52535740` // Blake Crouch
    }])
    const result = await gr.reviewsList(username)
    console.log(JSON.stringify(result))
  }
  main()
}

main()