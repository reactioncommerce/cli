import logger from "../utils/logger.js";

/**
 * @summary function to just check what logging looks like
 * @returns {Boolean} true
 */
export default function logCheck() {
  logger.info("Starting INFO logging");
  logger.info("Logging with object", { this: "thing" });
  logger.warn("Starting WARN logging");
  logger.warn("Logging with object", { this: "thing" });
  logger.error("Starting ERROR logging");
  logger.error("Logging with object", { this: "thing" });
  logger.debug("Starting DEBUG logging");
  logger.debug("Logging with object", { this: "thing" });
  logger.success("Starting SUCCESS logging");
  logger.success("Logging with object", { this: "thing" });
  return true;
}
