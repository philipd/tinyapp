const findUserByEmail = function (email, users) {
    for (const user_id in users) {
      const user = users[user_id];
      if (user.email === email) {
        return user;
      }
    }
  return undefined;
};

const urlsForUser = function (user_id, urlDatabase) {
  let result = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].user_id === user_id) {
      result[url] = urlDatabase[url];
    }
  }
  return result;
};

const generateRandomString = function () {
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

module.exports = { findUserByEmail: findUserByEmail, urlsForUser, generateRandomString };