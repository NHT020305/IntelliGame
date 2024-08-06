const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: "mongodb://localhost:27017",
    databaseName: "intelligame",
    collection: "sessions",
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "do-not-touch-this!",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    },
  };
}

module.exports = createSessionConfig;
