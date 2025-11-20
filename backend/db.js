const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.set("strictQuery", true);
const debug = require("debug")("db:dbconnection")
const connectDB = () => {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then((conn) => {
      debug(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((error) => {
      debug(error);
      process.exit(1);
    });
};

module.exports = connectDB;
