#!/usr/bin/env node

import { Command } from "commander/esm.mjs";
import commands from "./commands/index.js";

const program = new Command();

program
  .version("1.0.0")
  .command("demo").action(() => {
    commands.demo();
  });

program
  .command("create-project")
  .argument("<type>", "which project type to create")
  .argument("<name>", "what to name the project")
  .option("--populate")
  .action((type, name, options) => {
    commands.createProject(type, name, options);
  });

program.parse(process.argv);
