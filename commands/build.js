import buildApi from "./build-api.js";
import buildAdmin from "./build-admin.js";
import buildStorefront from "./build-storefront.js";

const functionMap = {
  api: buildApi,
  storefront: buildStorefront,
  admin: buildAdmin
};

/**
 * @summary build docker images for any project type
 * @param {String} type - The project type
 * @param {Object} options - Any additional options
 * @returns {Promise<Boolean>} true if successful
 */
export default async function build(type, options) {
  const results = await functionMap[type](options);
  return results;
}
