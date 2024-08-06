const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
    };
  }
  res.render("auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const email = req.body.email;
  const confirmEmail = req.body["confirm-email"];
  const password = req.body.password;
  const name = req.body.fullname;

  const enteredData = {
    email: email,
    confirmEmail: confirmEmail,
    password: password,
    fullname: name,
  };

  if (
    !validation.userDetailsAreValid(email, password, name) ||
    !validation.emailIsMatched(email, confirmEmail)
  ) {
    sessionFlash.flashDataToSession(
      req,
      { errorMessage: "Please check your input.", ...enteredData },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(email, password, name);

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        { errorMessage: "User exists already!", ...enteredData },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const user = new User(email, password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.comparePassword(existingUser.password);

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/technician-main");
  });
}

function logout(req, res) {
  authUtil.deleteUserSession(req);
  res.redirect("/");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
