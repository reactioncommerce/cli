#!/usr/bin/env node

import * as commander from "commander/esm.mjs";
import Configstore from "configstore";
import commands from "./commands/index.js";
import fs from "fs";

const program = new commander.Command();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const config = new Configstore(packageJson.name);

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

program.parse(process.argv);
