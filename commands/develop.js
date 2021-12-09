import developStorefront from "./develop-storefront.js";
import developAdmin from "./develop-admin.js";
import developApi from "./develop-api.js";

const functionMap = {
  api: developApi,
  admin: developAdmin,
  storefront: developStorefront
};


/**
 * @summary Run api in development mode
 * @param {String} projectType - Which project type to develop on
 * @param {Object} options - Develop options
 * @returns {Promise<Boolean>} True for success
 */
export default async function develop(projectType, options) {
  await functionMap[projectType](options);
}
