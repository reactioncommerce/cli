/* eslint-disable no-undef */

require("../../src/checkNodeVersion.cjs");

process.env = Object.assign(process.env, {
  MAIL_URL: "smtp://user:pass@email-smtp.us-west-2.amazonaws.com:465",
  REACTION_LOG_LEVEL: "ERROR",
  REACTION_WORKERS_ENABLED: false,
  MONGO_URL: "mongodb://localhost:27017/test"
});

process.on("unhandledRejection", (err) => {
  throw err;
});
