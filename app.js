const path = require("path");

const express = require("express");
//const csurf = require("csurf");
const expressSession = require("express-session");

const db = require("./data/database");
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
//const addCsrfToken = require("./middlewares/csrf");
const errorHandler = require("./middlewares/error-handler");
const createSessionConfig = require("./config/session");
const checkAuth = require("./middlewares/check-auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use('/imageStorage', express.static("imageStorage"));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
//app.use(csurf());

//app.use(addCsrfToken);
app.use(checkAuth);

app.use(baseRoutes);
app.use(authRoutes);

app.use(function(req, res) {
  res.status(404).render('shared/404');
})

app.use(errorHandler);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect!");
    console.log(error);
  });

