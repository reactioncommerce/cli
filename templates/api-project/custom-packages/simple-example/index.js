// This plugin example is only to show you how plugins can be added. For a more complete plugin template
// use the `create-plugin` command


/**
 * @summary register plugin
 * @param {Object} app - The application
 * @returns {Promise<void>} undefined
 */
export default async function register(app) {
  await app.registerPlugin({
    name: "example-plugin"
  });

  // eslint-disable-next-line no-console
  console.log("Simple Example app loaded");
}
