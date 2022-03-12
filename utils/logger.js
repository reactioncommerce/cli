import chalk from "chalk";

const cliName = "reaction-cli";

/* eslint-disable no-console */

/**
 * @summary generic logger
 * @param {String} color - The color to output the log message
 * @param {String} msg - String to display
 * @param {Object} obj - An object of any extra data
 * @returns {undefined} undefined
 */
function log(color, msg, obj = "") {
  if (obj && typeof obj === "object") {
    const stringifiedObj = JSON.stringify(obj, null, 0);
    console.log(`${chalk.blueBright(cliName)}: ${chalk[color](msg)}: ${chalk[color](stringifiedObj)}`);
  } else {
    console.log(`${chalk.blueBright(cliName)}: ${chalk[color](msg)}`);
  }
}

/**
 * @summary info logger
 * @param {String} msg - String to display
 * @param {Object} obj = An object of any extra data
 * @returns {undefined} undefined
 */
function info(msg, obj) {
  log("blue", msg, obj);
}

const loggers = {
  info,
  success(msg, obj = "") {
    log("green", msg, obj);
  },
  warn(msg, obj = "") {
    log("yellow", msg, obj);
  },
  error(msg, obj = "") {
    log("red", msg, obj);
  },
  debug(msg, obj = "") {
    if (process.env.REACTION_CLI_DEBUG !== "true") {
      return;
    }
    log("cyan", `[DEBUG] ${msg}`, obj);
  }
};

// extend chalk with custom log methods
export default Object.assign(chalk, loggers);
