import { Command } from "commander";
import { bedestenCommand } from "./commands/bedesten/index.js";

const program = new Command()
  .name("yargi")
  .description(
    "CLI tool for Turkish legal databases. " +
    "All commands output JSON to stdout for programmatic use. " +
    "Pipe output to jq for filtering. No authentication required."
  )
  .version("0.1.0")
  .addCommand(bedestenCommand);

program.parse();
