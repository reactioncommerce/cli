import { cleanEnv, bool } from "envalid";

export default cleanEnv(process.env, {
  SHOW_VERBOSE_TELEMETRY_DATA: bool({ default: false })
});
