function userDetailsAreValid(email, password, name) {
  return (
    email &&
    email.includes("@") &&
    password &&
    password.trim().length >= 8 &&
    name &&
    name.trim() !== ""
  );
}

function emailIsMatched(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsMatched: emailIsMatched,
};
