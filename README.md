<h1 align="center">
  node-goodreads
</h1>

A Node.JS Wrapper for the Goodreads API

* Goodreads API: http://goodreads.com/api
* Github: https://github.com/hueyy/node-goodreads

# Installation

```bash
npm i node-goodreads
```

# Using it

Grab a Goodreads developer key and secret from [https://www.goodreads.com/api/keys](https://www.goodreads.com/api/keys).

```js
const Goodreads = require(`node-goodreads`)
const gr = Goodreads({ key, secret })
```

oauth functions not implemented yet.