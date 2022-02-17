import { spawn } from "child_process";
import prompts from "prompts";
import { sync as cmdExists } from "command-exists";
import Logger from "../utils/logger.js";

/**
 * @summary install Meteor for the user if it's not already installed
 * @returns {Promise<boolean>} - true if successful
 */
export default async function installMeteorIfMissing() {
  const meteorExists = cmdExists("meteor");
  if (!meteorExists) {
    const { isOkayToInstall } = await prompts({
      type: "confirm",
      name: "isOkayToInstall",
      message: "This project requires Meteor to run which needs to be installed globally, is it okay to install it?",
      initial: true
    });
    return new Promise((resolve) => {
      if (isOkayToInstall) {
        const args = ["https://install.meteor.com/?release=2.6"];
        const meteorInstall = spawn("curl", args);
        const shell = spawn("sh");
        // the curl and the sh are two separate commands that run in different process
        // so we run both and pipe the output of one to the other
        meteorInstall.stdout.pipe(shell.stdin);

        // for some reason all the output on the shell command comes through stderr
        shell.stderr.on("data", (data) => {
          // eslint-disable-next-line no-console
          console.log(data.toString().trim()); // Echo output of command to console
        });

        shell.stderr.on("close", () => {
          const meteorInstallationComplete = cmdExists("meteor");
          if (meteorInstallationComplete) {
            Logger.info("Meteor installation complete");
            resolve(true);
          } else {
            Logger.error("Process completed but Meteor installation was unsuccessful");
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }
  return true;
}
