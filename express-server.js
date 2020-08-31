const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function() {
  const chars = '23456789qwertyuipasdfghjkzxcvbnmQWERTYUPASDFGHJKLZXCVBNM'; // no ambiguous characters (o, O, 0, I, l, 1)
  const arrChars = Array.from(chars);
  let result = '';

  for (let i = 0; i < 6; i++) {
    let randomNumber = Math.random() * chars.length;
    randomNumber = Math.floor(randomNumber);
    result += arrChars[randomNumber];
  }

  return result;
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls-index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls-new');
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls-show', templateVars);
});

app.post('/urls', (req, res) => {
  let id = generateRandomString()
  urlDatabase[id] = req.body.longURL;
  console.log(req.body);
  console.log(urlDatabase);
  res.redirect('/urls/'+id);
});