#!/usr/bin/env node
import * as commander from "commander/esm.mjs";
import commands from "./commands/index.js";
import pkg from "./package.json";

const program = new commander.Command();

program.version(pkg.version);

program
  .command("demo")
  .description("Run Open Commerce locally in non-dev mode using docker-compose")
  .argument("<path>", "Where to copy the demo files")
  .action((path) => {
    commands.demo(path);
  });

program
  .command("create-project")
  .description("Create a new Open Commerce project of one of the three types")
  .addArgument(new commander.Argument("<type>", "which project type to create").choices(["api", "storefront", "admin"]))
  .argument("<name>", "what to name the project")
  .option("--populate")
  .action((type, name, options) => {
    commands.createProject(type, name, options);
  });

program
  .command("create-plugin")
  .description("Create a new plugin based on the template for an API project")
  .addArgument(new commander.Argument("<type>", "which project type to create").choices(["api", "admin"]))
  .argument("<name>", "what to name the plugin")
  .action((type, name, options) => {
    commands.createPlugin(type, name, options);
  });

program
  .command("develop")
  .description("Run a project in locally in development mode")
  .addArgument(new commander.Argument("[type]", "which project type to develop on")
    .choices(["api", "storefront", "admin"])
    .default("api"))
  .option("--debug")
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

program.parse(process.argv);
