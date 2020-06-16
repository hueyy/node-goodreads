<h1 align="center">
  node-goodreads
</h1>

A Node.JS Wrapper for the Goodreads API

Forked from [bdickason/node-goodreads](https://github.com/bdickason/node-goodreads), which appears to be unmaintained.

* Goodreads API: http://goodreads.com/api
* Github: https://github.com/hueyy/node-goodreads

# Installation

```bash
npm i node-goodreads
```

# Using it

Grab a Goodreads developer key and secret from [https://www.goodreads.com/api/keys](https://www.goodreads.com/api/keys).

```js
const goodreads = require(`node-goodreads`)
const gr = new goodreads.client({ key, secret })
```

# Examples

Examples are available in the examples folder

```js
gr.getShelves(`username`).then(json => console.log(json))

// or
const json = await gr.getShelves(`username`)
console.log(json)

```

# Functions

**getShelves** - Get all shelves for a given user
* Input: userId
* Output: json (as callback)
* Example: `getShelves '4085451', (json) ->`

**getSingleShelf** - Get a specific list by ID
* Input: shelfOptions object with userID (required), shelf (required), page (optional), and per_page (optional) properties.
* Output: json (as callback)
* Example: `getSingleShelf {'userID': '4085451', 'shelf': 'web', 'page': 1, 'per_page': 200}, (json) ->`

**requestToken** - OAUTH: calls back an object with oauthToken, oauthTokenSecret, and the URL!
* Input: none
* Output: json `{ oauthToken: 'iu1iojij14141411414', oauthTokenSecret: 'j1kljklsajdklf132141', url: 'http://goodreads.com/blah'}`
* Example: `requestToken (callback) ->`

**processCallback** - expects: oauthToken, oauthTokenSecret, authorize (from the query string)
_Note: call this after requestToken!_
* Input: oauthToken, oauthTokenSecret, authorize
* Output: json `{ 'username': 'Brad Dickason', 'userid': '404168', 'success': 1, 'accessToken': '04ajdfkja', 'accessTokenSecret': 'i14k31j41jkm' }`
* Example: `processCallback oauthToken, oauthTokenSecret, params.query.authorize, (callback) ->`

**getAuthor** - Get paginated list of books for a given author
* Input: authorId, page
* Output: json (as callback)
* Example: `Example: getAuthor '18541', 2, (json) ->`

**getSeries** - Get all books in a given series
* Input: seriesId
* Output: json (as callback)
* Example: `getSeries '40650', (json) ->`
