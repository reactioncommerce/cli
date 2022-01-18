#!/usr/bin/env node

import fs from "fs";
import * as commander from "commander/esm.mjs";
import commands from "./commands/index.js";

const program = new commander.Command();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

program
  .version(packageJson.version)
  .command("demo").action(() => {
    commands.demo();
  });

program
  .command("logcheck").action(() => {
    commands.logcheck();
  });

program
  .command("create-project")
  .addArgument(new commander.Argument("<type>", "which project type to create").choices(["api", "storefront", "admin"]))
  .argument("<name>", "what to name the project")
  .option("--populate")
  .action((type, name, options) => {
    commands.createProject(type, name, options);
  });

program
  .command("create-plugin")
  .addArgument(new commander.Argument("<type>", "which project type to create").choices(["api", "admin"]))
  .argument("<name>", "what to name the plugin")
  .action((type, name, options) => {
    commands.createPlugin(type, name, options);
  });

program
  .command("develop")
  .addArgument(new commander.Argument("[type]", "which project type to develop on").choices(["api", "storefront", "admin"]).default("api"))
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
