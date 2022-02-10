import { createRequire } from "module";
import Configstore from "configstore";


const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const config = new Configstore(pkg.name);

/**
 * @summary return config from configstore
 * @returns {Configstore} - The global configstore
 */
export default function getConfig() {
  return config;
}
