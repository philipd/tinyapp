# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs.

## Final Product

!["Index Page"](https://raw.githubusercontent.com/philipd/tinyapp/master/docs/urls-index.png?token=AAJAOTFRN6JIQFVFASQ2A2K7LLHMY)
!["URL Details & Edit Page"](https://raw.githubusercontent.com/philipd/tinyapp/master/docs/urls-show.png?token=AAJAOTC4HUYR5OCZLJ33LNK7LLHM2)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Optionally, set a session encryption key in your environment's `TINYAPP_SECRET` variable.
- Run the development web server with `node express-server.js` or `npm run start`.
- The default port number is 8080, but you can specify a different one via command-line argument, e.g. `node express-server.js 3000`
