import Configstore from "configstore";
import constants from "../utils/constants.js";

const { PACKAGE_NAME } = constants;
const config = new Configstore(PACKAGE_NAME);

/**
 * @summary return config from configstore
 * @returns {Configstore} - The global configstore
 */
export default function getConfig() {
  return config;
}
