import fetch from "node-fetch";
import env from "../config.js";
import Logger from "./logger.js";
import constants from "./constants.js";

const GA_ENDPOINT = "https://www.google-analytics.com/collect";

/**
 * @summary send usage information to GA in GA4 format
 * @param {String} clientId - the client id to use
 * @returns {Promise<{Object}>} - Return the client object
 */
export default function ga4(clientId) {
  const client = {
    pageview: async (page, customDimensions, debug = true) => {
      /* Parameters reference
       * v - version, must be 1
       * t - event type, we are using pageview
       * aip - anonymize IP
       * ua - user agent, We MUST have the ua param, otherwise the request will fail silently
       * tid - our GA tracking ID
       * cid - client ID
       * dp - the name of the current page
       * cd* - customDimensions
       */
      let params = `v=1&t=pageview&aip=1&ua=Terminal&tid=${constants.GA_TRACKING_ID}&cid=${clientId}&dp=${page}`;
      // append all custom dimensions to query parameters
      for (const [key, value] of Object.entries(customDimensions)) {
        params = `${params}&${key}=${value}`;
      }
      const response = await fetch(GA_ENDPOINT, {
        headers: {
          "content-type": "text/plain"
        },
        method: "POST",
        body: params
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
