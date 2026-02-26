#!/usr/bin/env node
const { program } = require("commander");
const { buildHtml360 } = require("./builder");
const { installMenu, uninstallMenu } = require("./menu");

program
  .argument("<image...>", "List of images to process")
  .action(buildHtml360);

program
  .command("install-menu")
  .description('Add html360 to Windows "Send To" menu')
  .action(installMenu);

program
  .command("uninstall-menu")
  .description('Remove html360 from Windows "Send To" menu')
  .action(uninstallMenu);

program.parse(process.argv);
