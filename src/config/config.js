require("dotenv").config();
const path = require("path");

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  dataFilePath: path.join(__dirname, "../../data/tasks.json"),
};