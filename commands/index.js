import telemetryCheck from "../utils/telemetryCheck.js";
import track from "../utils/track.js";
import demo from "./demo.js";
import createProject from "./create-project.js";
import createPlugin from "./create-plugin.js";
import develop from "./develop.js";
import logcheck from "./logcheck.js";

export default {
  demo: () => {
    telemetryCheck();
    demo();
    track("demo", {}, {});
  },
  createProject: (projectType, projectName, options) => {
    telemetryCheck();
    createProject(projectType, projectName, options);
    track(`create-project/${projectType}`, {}, options);
  },
  develop,
  createPlugin,
  logcheck
};
