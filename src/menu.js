const ws = require("windows-shortcuts");
const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");

const HTML360_LINK_PATH = path.join(
  process.env.APPDATA,
  "Microsoft",
  "Windows",
  "SendTo",
  "html360.lnk",
);

const MENU_BAT_PATH = path.join(__dirname, "menu.bat");

const MENU_ICO_PATH = path.join(__dirname, "html360.ico");

function installMenu() {
  if (process.platform !== "win32") {
    logger.error("This feature is only available on Windows.");
    return;
  }

  ws.create(
    HTML360_LINK_PATH,
    {
      target: MENU_BAT_PATH,
      icon: MENU_ICO_PATH,
    },
    (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.success(`"Send To" menu shortcut created successfully!`);
      }
    },
  );
}

function uninstallMenu() {
  if (!fs.existsSync(HTML360_LINK_PATH)) {
    logger.info("No menu shortcut found to remove.");
    return;
  }

  fs.unlinkSync(HTML360_LINK_PATH);
  logger.success("Menu shortcut removed successfully.");
}

module.exports = {
  installMenu,
  uninstallMenu,
};
