import telemetryCheck from "../utils/telemetryCheck.js";
import track from "../utils/track.js";
import checkForNewVersion from "../utils/checkForNewVersion.js";
import versionSupportCheck from "../utils/versionSupportCheck.js";
import createProjectDemo from "./create-project-demo.js";
import createProject from "./create-project.js";
import createPlugin from "./create-plugin.js";
import develop from "./develop.js";
import telemetry from "./telemetry.js";
import build from "./build.js";
import update from "./update.js";

export default {
  demo: (demoPath) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    createProjectDemo(demoPath);
    track("demo", {}, {});
  },
  createProject: (projectType, projectName, options) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    createProject(projectType, projectName, options);
    track(`create-project/${projectType}`, {}, options);
  },
  develop: (projectType, options) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    develop(projectType, options);
    track(`develop/${projectType}`, {}, options);
  },
  createPlugin: (type, pluginName, options) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    createPlugin(type, pluginName, options);
    track(`create-plugin/${type}`, {}, options);
  },
  build: (type, options) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    build(type, options);
    track(`build/${type}`, {}, options);
  },
  telemetry: (args) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    telemetry(args);
    track(`telemetry/${args}`, {}, {});
  },
  update: (options) => {
    versionSupportCheck();
    telemetryCheck();
    checkForNewVersion();
    update(options);
    track(`update/${options}`, {}, {});
  }
};
