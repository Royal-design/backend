const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    const logsDir = path.join(__dirname, "..", "logs");

    // Create logs folder if it doesn’t exist
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }

    // Append log entry
    await fsPromises.appendFile(path.join(logsDir, logName), logItem);
  } catch (error) {
    console.error(error);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.headers.origin || "no-origin"}\t${req.url}`,
    "reqLog.txt"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

// Export for CommonJS
module.exports = { logEvents, logger };
