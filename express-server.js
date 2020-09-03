const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", user_id: "aJ48lW" }
};

const users = {
  'aJ48lW': { user_id: 'aJ48lW', email: 's@s.com', password: 'asdf' }
};

const findUsersByEmail = function(email) {
  let results = [];
  for (const user_id in users) {
    const user = users[user_id];
    if (user.email === email) {
      results.push(user);
    }
  }
  return results;
};

const urlsForUser = function(user_id) {
  let result = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].user_id === user_id) {
      result[url] = urlDatabase[url];
    }
  }
  console.log(result);
  return result;
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
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  let templateVars = { urls: urlsForUser(user_id), user };
  // console.log('Users: ', users);
  // console.log('user_id: ', user_id);
  // console.log('urls: ', urlDatabase);
  // console.log('urlsForThisUser: ', urlsForUser(user_id));
  res.render('urls-index', templateVars);
});

app.get('/urls/new', (req, res) => {
  if (!req.cookies.user_id) {
    return res.redirect('/login');
  }
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  let templateVars = { user };
  res.render('urls-new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  res.render('urls-show', templateVars);
});

app.get('/register', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  let templateVars = { user };
  res.render('user-registration', templateVars);
});

app.get('/login', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  let templateVars = { user };
  res.render('user-login', templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email.length === 0 || password.length === 0) {
    console.log('ERROR! EMPTY EMAIL OR PASSWORD');
    res.status(400);
    return res.send('You must supply an email and a password');
  }

  if (findUsersByEmail(email).length !== 0) {
    console.log('ERROR! ALREADY EXISTS', email);
    res.status(400);
    return res.send('A user with that email already exists');
  }

  const user_id = generateRandomString();
  users[user_id] = { user_id: user_id, email: req.body.email, password: req.body.password };
  res.cookie('user_id', user_id);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = findUsersByEmail(email)[0];
  if (!user || user.password !== password) {
    res.status(403);
    return res.send('Invalid credentials');
  }
  res.cookie('user_id', user.user_id);
  return res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const id = req.params.shortURL;
  urlDatabase[id].longURL = req.body.longURL;
  urlDatabase[id].user_id = req.cookies.user_id;
  console.log(urlDatabase);
  res.redirect('/urls/' + id);
});

app.post('/urls', (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = { longURL: req.body.longURL, user_id: req.cookies.user_id }
  res.redirect('/urls/' + id);
});

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});