const { createLogger, transports, format } = require("winston")

const logFilePaths = {
  node: {
    errors: "./logs/node/errors.log",
    info: "./logs/node/info.log",
  },
  sequelize: {
    errors: "./logs/sequelize/errors.log",
    info: "./logs/sequelize/info.log",
  },
}

const sequelizeLogger = createLogger({
  format: format.simple(),
  transports: [
    new transports.File({
      filename: logFilePaths.sequelize.info,
      level: "debug",
      eol: "\n\n",
      options: { flags: "w" },
    }),
  ],
})

const nodeLogger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp, stack }) => {
      if (stack) {
        return `${timestamp}\n${level}: ${message}\n${stack}\n`
      }
      return `${timestamp}\n${level}: ${message}\n`
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: logFilePaths.node.errors,
      level: "error",
      options: { flags: "w" },
    }),
  ],
})

module.exports = {
  sequelizeLogger,
  nodeLogger,
}