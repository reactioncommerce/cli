#!/usr/bin/env node
import { createRequire } from "module";
import * as commander from "commander/esm.mjs";
import commands from "./commands/index.js";


const require = createRequire(import.meta.url);
const pkg = require("./package.json");


const program = new commander.Command();

program.version(pkg.version);

program
  .command("clone-api-plugins")
  .description("Clone the official Open Commerce API plugins locally")
  .option("-m, --manual-select", "Select the specific plugins you want to clone")
  .option("--no-link", "Don't link the local plugins to the api project")
  .action((options) => {
    commands.cloneApiPlugins(options);
  });

program
  .command("create-project")
  .description("Create a new Open Commerce project of one of several types")
  .addArgument(new commander.Argument("<type>", "which project type to create").choices(["api", "storefront", "admin", "demo"]))
  .argument("<name>", "what to name the project")
  // .option("--populate")
  .option("--skip-meteor-install", "Skip Meteor install when creating admin project")
  .option("--dont-start-demo", "Don't auto start the demo project after creation")
  .action((type, name, options) => {
    commands.createProject(type, name, options);
  });

program
  .command("create-plugin")
  .description("Create a new plugin based on the template for a project type. To create an API plugin, you must be in an API project directory.")
  .addArgument(new commander.Argument("<type>", "which project type to create").choices(["api"]))
  .argument("<name>", "what to name the plugin")
  .action((type, name, options) => {
    commands.createPlugin(type, name, options);
  });

program
  .command("develop")
  .description("Run a project locally in development mode")
  .addArgument(new commander.Argument("[type]", "which project type to develop on")
    .choices(["api", "storefront", "admin"]))
  .option("--no-debug")
  .option("--no-mongo-shutdown", "don't shut down mongo on abort")
  .action((type, options) => {
    commands.develop(type, options);
  });

program
  .command("telemetry")
  .description("Toggle on or off reporting anonymous usage")
  .addArgument(new commander.Argument("<flag>", "Whether telemetry is on or off").choices(["on", "off"]))
  .action((flag) => {
    commands.telemetry(flag);
  });

program
  .command("update")
  .description("Update API plugins")
  .option("--all", "Update all outdated plugins")
  .action((options) => {
    commands.update(options);
  });

program.parse(process.argv);
