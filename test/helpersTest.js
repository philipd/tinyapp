const { assert } = require('chai');
const { findUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", user_id: "aJ48lW" },
  "509dhj": { longURL: "http://www.gail.com", user_id: "k35zkF" }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const actual = findUserByEmail("user@example.com", testUsers).id;
    const expected = "userRandomID";
    assert.equal(actual, expected);
  });
  it('should return undefined if no user is registered with the given email', function () {
    const actual = findUserByEmail("user@gail.com", testUsers);
    assert.isUndefined(actual);
  });
  it('should return undefined if the user database is empty', function () {
    const actual = findUserByEmail("user@gail.com", {});
    assert.isUndefined(actual);
  });
});

describe('generateRandomString', () => {
  it('should generate the correct number of characters', () => {
    let actual = generateRandomString(6).length;
    assert.equal(actual, 6);
    actual = generateRandomString(12).length;
    assert.equal(actual, 12);
  });
  it('should return different results in response to successive identical calls', () => {
    const result1 = generateRandomString(6);
    const result2 = generateRandomString(6);
    assert.notEqual(result1, result2);
  });
  it('should generate characters with approximately equal probability', () => {
    const longString = generateRandomString(1000000);
    const results = {};
    let min;
    let max;

    for (const char of longString) {
      if (results[char] === undefined) {
        results[char] = 0;
      } else {
        results[char] += 1;
      }
    }

    for (const char in results) {
      const count = results[char];
      if (!min && !max) {
        min = count;
        max = count;
      } else {
        min = count < min ? count : min;
        max = count > max ? count : max;
      }
    }

    assert.isAbove(min / max, 0.96);
  });
});

describe('urlsForUser', () => {
  it('should return all the URLs in a database associated with a given user', () => {
    const result = urlsForUser('aJ48lW', urlDatabase);
    const expected = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: "aJ48lW" },
      "9sm5xK": { longURL: "http://www.google.com", user_id: "aJ48lW" }
    };
    assert.deepEqual(result, expected);
  });
  it('should return undefined if the provided user id does not have any urls associated with it', () => {
    const result = urlsForUser('fhj253', urlDatabase);
    const expected = {};
    assert.deepEqual(result, expected);
  });
});