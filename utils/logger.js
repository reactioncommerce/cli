import chalk from "chalk";

/* eslint-disable no-console */

/**
 * @summary info logger
 * @param {String} msg - String to display
 * @param {Object} obj = An object of any extra data
 * @returns {undefined} undefined
 */
function info(msg, obj) {
  if (obj) {
    console.log(chalk.blue(`moccli: ${msg}: ${obj}`));
  } else {
    console.log(chalk.blue(`moccli: ${msg}`));
  }
}

const loggers = {
  info,
  success(msg) {
    console.log(chalk.green(`moccli: ${msg}`));
  },
  warn(msg) {
    console.log(chalk.yellow(`moccli: ${msg}`));
  },
  error(msg) {
    console.log(chalk.bold.red(`moccli: ${msg}`));
  },
  debug(msg) {
    if (process.env.REACTION_CLI_DEBUG === "true") {
      console.log(chalk.yellow("[DEBUG]:"), msg);
    }
  },
  args(args) {
    if (process.env.REACTION_CLI_DEBUG === "true") {
      console.log(chalk.yellow("\n[MOC CLI Debug]\n\n"), args, "\n");
    }
  },
  default(msg) {
    console.log(`moccli: ${msg}`);
  }
};

// extend chalk with custom log methods
export default Object.assign(chalk, loggers);
