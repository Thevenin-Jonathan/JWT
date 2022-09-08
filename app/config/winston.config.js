const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint, colorize, errors, } = format;

const transportsList = [
  new transports.File({ filename: 'logs/error.log', level: 'error', handleExceptions: true })
]

if (process.env.NODE_ENV !== "production") {
  transportsList.push(new transports.Console());
}

const logger = createLogger({
  level: 'debug',
  format: combine(
    errors({ stack: true }),
    colorize(),
    timestamp(),
    prettyPrint()
  ),
  transports: transportsList,
  exceptionHandlers: [
    new transports.File({ filename: 'logs/error.log', level: 'error', handleExceptions: true })
  ],
});

process.on('uncaughtException', err => {
  logger.error('uncaughtException', { message: err.message, stack: err.stack });
});

process.on('unhandledRejection', err => {
  logger.error('uncaughtException', { message: err.message, stack: err.stack });
});

module.exports = { logger };