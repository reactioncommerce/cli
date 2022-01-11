import chalk from "chalk";

/* eslint-disable no-console */

/**
 * @summary info logger
 * @param {Object} obj = An object of any extra data
 * @param {String} msg - String to display
 * @returns {undefined} undefined
 */
function info(obj, msg = {}) {
  if (obj) {
    const stringifiedObj = JSON.stringify(obj, 2, null);
    console.log(chalk.blue(`cli: ${stringifiedObj}: ${msg}`));
  } else {
    console.log(chalk.blue(`cli: ${msg}`));
  }
}

const loggers = {
  info,
  success(msg) {
    console.log(chalk.green(`cli: ${msg}`));
  },
  warn(msg) {
    console.log(chalk.yellow(`cli: ${msg}`));
  },
  error(msg) {
    console.log(chalk.bold.red(`cli: ${msg}`));
  },
  debug(msg) {
    if (process.env.REACTION_CLI_DEBUG === "true") {
      console.log(chalk.yellow("[DEBUG]:"), msg);
    }
  },
  args(args) {
    if (process.env.REACTION_CLI_DEBUG === "true") {
      console.log(chalk.yellow("\n[CLI Debug]\n\n"), args, "\n");
    }
  },
  default(msg) {
    console.log(`cli: ${msg}`);
  }
};

// extend chalk with custom log methods
export default Object.assign(chalk, loggers);
