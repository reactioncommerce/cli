import Logger from "../utils/logger.js";
import checkPort from "./checkPort.js";


/**
 * @summary check if all the ports where the system will run are available
 * @returns {Promise<Object>} - if all system ports are available
 */
export default async function portCheck() {
  const admin = await checkPort("http://localhost:4080");
  const storefront = await checkPort("http://localhost:4000");
  const api = await checkPort("http://localhost:3000");
  Logger.info("Checking available ports");
  const results = await Promise.all([admin, storefront, api]);
  const portsMap = [
    { port: 4080, inUse: admin }, { port: 4000, inUse: storefront }, { port: 3000, inUse: api }
  ];
  return { portsResults: results, portsMap };
}
