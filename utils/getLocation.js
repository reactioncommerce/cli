import publicIp from "public-ip";
import fetch from "node-fetch";

const endPoint = "https://api.iplocation.net/?cmd=ip-country&format=json&ip=";

/**
 * @summary get the users location based on their IP Address
 * @returns {Promise<String>} - The country code of the user based on their ip
 */
export default async function getLocation() {
  try {
    const ip = await publicIp.v4();
    if (!ip) return null; // if we are offline, then don't do another request
    const lookupUrl = `${endPoint}${ip}`;
    const response = await fetch(lookupUrl);
    const data = await response.json();
    const { country_code2: countryCode } = data;
    return countryCode;
  } catch (error) {
    return null;
  }
}
