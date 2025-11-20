const MongoStore = require("connect-mongo");

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "sessions",
});

module.exports = sessionStore;
