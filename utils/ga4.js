import fetch from "node-fetch";
import env from "../config.js";
import Logger from "./logger.js";

const endpoint = "https://api.merchstack-demo.com/"; // THIS IS FAKE, this will be replaced by a Lambda endpoint

/**
 * @summary send usage information to GA in GA4 format
 * @param {String} clientId - the client id to use
 * @returns {Promise<{Object}>} - Return the client object
 */
export default function ga4(clientId) {
  const client = {
    pageview: async (page, customDimensions, debug = true) => {
      const body = {
        // eslint-disable-next-line camelcase
        client_id: clientId,
        events: [{
          name: "pageview",
          params: {
            dp: page
          }
        }]
      };
      // append all custom dimensions to parameters
      const dimKeys = Object.keys(customDimensions);
      for (const dimension of dimKeys) {
        body.events[0].params[dimension] = customDimensions[dimension];
      }
      const response = await fetch(endpoint, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      // in production mode the call produces no response
      if (debug) {
        try {
          const data = await response.json();
          return data;
        } catch (error) {
          // swallow this silently
          // TODO: Add SENTRY reporting or something
          if (env.SHOW_VERBOSE_TELEMETRY_DATA) {
            Logger.error("Could not send telemetry data");
          }
        }
      }
      return null;
    }
  };
  return client;
}
