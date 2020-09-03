const { assert } = require('chai');
const { findUsersByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const actual = findUsersByEmail("user@example.com", testUsers)[0].id;
    const expected = "userRandomID";
    assert.equal(actual, expected);
  });
  it('should return an array with a single value if a user exists with the given email', function () {
    const actual = findUsersByEmail("user@example.com", testUsers);
    assert.lengthOf(actual, 1);
  });
  it('should return an empty array if no user is registered with the given email', function () {
    const actual = findUsersByEmail("user@gail.com", testUsers);
    assert.isArray(actual);
    assert.isEmpty(actual);
  });
  it('should return an empty array if the user database provided is empty', function () {
    const actual = findUsersByEmail("user@example.com", {});
    assert.isArray(actual);
    assert.isEmpty(actual);
  });
});