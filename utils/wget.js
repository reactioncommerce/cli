import fetch from "node-fetch";

/**
 * @summary get raw content from a github repo
 * @param {String} path - The full URL path of the context to get
 * @returns {Promise<string>} The raw file contents
 */
export default async function wget(path) {
  const response = await fetch(path);
  const body = await response.text();
  return body;
}
