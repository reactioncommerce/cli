import fetch from "node-fetch";

/**
 * @summary check if a local port returns a response
 * @param {String} path - The path the check
 * @returns {Promise<boolean>} - If the port responded
 */
export default async function checkPort(path) {
  try {
    const results = await fetch(path);
    return !!results;
  } catch (error) {
    return false;
  }
}
