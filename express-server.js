// Requires
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { findUserByEmail, urlsForUser, generateRandomString } = require('./helpers');

// Numerical constants
const PORT = 8080;
const saltRounds = 10;
const idLength = 6;

// Sample data
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", user_id: "aJ48lW" }
};
const users = {
  'aJ48lW': { user_id: 'aJ48lW', email: 's@s.com', password: bcrypt.hashSync('asdf', saltRounds) }
};

// App configuration
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cookieSession({ secret: '#(*gnq3j(Q49f3unq93u' })); // TODO: store secret securely!

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// GETs
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = { urls: urlsForUser(user_id, urlDatabase), user };
  res.render('urls-index', templateVars);
});

app.get('/urls/new', (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = { user };
  res.render('urls-new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const urlID = req.params.shortURL;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[urlID].user_id;

  console.log(urlID, currentUser, urlOwner);

  if (currentUser !== urlOwner) {
    res.status(403);
    return res.send("You don't have permission to view this page");
  }
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  res.render('urls-show', templateVars);
});

app.get('/register', (req, res) => {
  if(req.session.user_id){
    return res.redirect('/urls');
  }
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = { user };
  res.render('user-registration', templateVars);
});

app.get('/login', (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  }

  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = { user };
  res.render('user-login', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// POSTs
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  if (email.length === 0 || password.length === 0) {
    res.status(400);
    return res.send('You must supply an email and a password');
  }

  if (findUserByEmail(email, users) !== undefined) {
    res.status(400);
    return res.send('A user with that email already exists');
  }

  const user_id = generateRandomString(idLength);
  users[user_id] = { user_id: user_id, email: req.body.email, password: hashedPassword };
  req.session.user_id = user_id;
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = findUserByEmail(email, users);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(403);
    return res.send('Invalid credentials');
  }
  req.session.user_id = user.user_id;
  return res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const urlID = req.params.shortURL;
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[urlID].user_id;

  if (currentUser !== urlOwner) {
    res.status(403);
    return res.send("You don't have permission to edit this URL");
  }

  urlDatabase[urlID].longURL = req.body.longURL;
  urlDatabase[urlID].user_id = req.session.user_id;

  res.redirect('/urls/');
});

app.post('/urls', (req, res) => {
  let id = generateRandomString(idLength);

  if (!req.session.user_id) {
    res.status(403);
    return res.send("You must log in to create shortened urls");
  }

  urlDatabase[id] = { longURL: req.body.longURL, user_id: req.session.user_id };
  res.redirect('/urls/');
});


app.post('/urls/:shortURL/delete', (req, res) => {
  const currentUser = req.session.user_id;
  const urlOwner = urlDatabase[req.params.shortURL].user_id;

  if (currentUser !== urlOwner) {
    res.status(403);
    return res.send("You don't have permission to delete this URL");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});