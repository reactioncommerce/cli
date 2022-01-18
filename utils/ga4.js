import fetch from "node-fetch";
import constants from "../utils/constants.js";

const { GA_TRACKING_ID, API_SECRET } = constants;
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_TRACKING_ID}&api_secret=${API_SECRET}`;
const DEBUG_ENDPOINT = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${GA_TRACKING_ID}&api_secret=${API_SECRET}`;

// API_SECRET:  GA > Admin > Data Streams > choose your stream > Measurement Protocol > Create
/**
 * @summary send usage information to GA in GA4 format
 * @param {String} clientId - the client id to use
 * @returns {Promise<{Object}|null>} - Return the response in debug mode, null in production
 */
export default function ga4(clientId) {
  const CLIENT_ID = clientId;
  const client = {
    pageview: async (page, customDimensions, debug = true) => {
      let ENDPOINT;
      if (debug) {
        ENDPOINT = DEBUG_ENDPOINT;
      } else {
        ENDPOINT = GA_ENDPOINT;
      }
      const body = {
        // eslint-disable-next-line camelcase
        client_id: CLIENT_ID,
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
      const response = await fetch(ENDPOINT, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      // in production mode the call produces no response
      if (debug) {
        const data = await response.json();
        return data;
      }
      return null;
    }
  };
  return client;
}
