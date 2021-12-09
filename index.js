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
  .command("create")
  .argument("<project>", "which project type to create")
  .action((project) => {
    commands.create(project);
  });

program.parse(process.argv);
