import Configstore from "configstore";
import pkg from "../package.json";

const config = new Configstore(pkg.name);

/**
 * @summary return config from configstore
 * @returns {Configstore} - The global configstore
 */
export default function getConfig() {
  return config;
}
