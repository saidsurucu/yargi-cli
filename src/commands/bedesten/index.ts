import { Command } from "commander";
import { searchCommand } from "./search.js";
import { docCommand } from "./doc.js";

export const bedestenCommand = new Command("bedesten")
  .description(
    "Search and retrieve Turkish court decisions from Bedesten (bedesten.adalet.gov.tr). " +
    "Covers: Yargitay (Court of Cassation), Danistay (Council of State), local civil courts, " +
    "appellate courts (Istinaf), and extraordinary appeals (KYB). " +
    "All output is JSON to stdout, suitable for piping to jq or programmatic consumption."
  )
  .addCommand(searchCommand)
  .addCommand(docCommand);
