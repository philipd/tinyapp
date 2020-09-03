const { assert } = require('chai');
const { findUserByEmail } = require('../helpers.js');

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