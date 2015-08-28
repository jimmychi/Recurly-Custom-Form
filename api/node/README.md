## API example: Node + Express

This small application demonstrates how you might set up a web server
using Node.js and [Express][express] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the [node-recurly][node-recurly] module, an
unofficial node client library for Recurly's v2 API.

Note that it is not necessary to use the Express framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions within another application
framework.

### Routes

- `POST` [/api/subscriptions/new](app.js#L18-46)
- `POST` [/api/accounts/new](app.js#L49-59)
- `PUT` [/api/accounts/:account_code](app.js#L62-72)

### Use

1. Start the server

  ```bash
  $ npm i
  $ node app
  ```
2. Open [http://localhost:9001](http://localhost:9001)

[express]: http://expressjs.com/
[node-recurly]: https://github.com/cgerrior/node-recurly
