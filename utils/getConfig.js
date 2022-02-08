import Configstore from "configstore";
import getPackageData from "../utils/getPackageData.js";

const pkg = getPackageData();
const config = new Configstore(pkg.name);

/**
 * @summary return config from configstore
 * @returns {Configstore} - The global configstore
 */
export default function getConfig() {
  return config;
}
