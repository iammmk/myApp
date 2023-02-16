function isEmailValid(email) {
  //RFC 2822 Email check
  var emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return emailRegex.test(email);
}

function isUsernameValid(username) {
  //twitter username--> max ch =15, use only=alphanumeric ch and underscore
  var usernameRegex = /^[a-zA-Z0-9_]{1,15}$/i;
  return usernameRegex.test(username);
}

module.exports = {
  isEmailValid,
  isUsernameValid,
};
