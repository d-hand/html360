const c = require("ansi-colors");

const INFO = c.cyan.bold("[INFO]:");
const OK = c.green.bold("[OK]:");
const ERROR = c.red.bold("[ERROR]:");

const logger = {
  info: (msg) => console.log(`${INFO} ${c.cyan(msg)}`),

  success: (msg) => console.log(`${OK} ${c.green(msg)}`),

  error: (err) => {
    if (err instanceof Error) {
      console.error(`${ERROR} ${c.red(err.message)}`, err);
    } else {
      console.error(`${ERROR} ${c.red(err)}`);
    }
  },
};

module.exports = {
  logger,
};
