import concat from "concat-stream";
import createProcess from "./createProcess.js";


/**
 * @summary execute a child process for testing
 * @param {String} processPath - The path to the process
 * @param {Array} args - An array of args
 * @param {Object} opts - Options
 * @returns {Promise<Array<String>>} - The console results of the process
 */
export default function execute(processPath, args = [], opts = {}) {
  const { env = null } = opts;
  const childProcess = createProcess(processPath, args, env);
  childProcess.stdin.setEncoding("utf-8");
  const promise = new Promise((resolve, reject) => {
    childProcess.stderr.once("data", (err) => {
      reject(err.toString());
    });
    childProcess.on("error", reject);
    childProcess.stdout.pipe(concat((result) => {
      resolve(result.toString());
    }));
  });
  return promise;
}
