from log import Logger, LevelFilter, Formatter, ConsoleHandler, LogLevel, FileLogHandler

logger = Logger(
	filters=LevelFilter(LogLevel.DEBUG),
	formatters=Formatter(),
	handlers=[ConsoleHandler(), FileLogHandler('log.txt')],
)
logger.log(LogLevel.INFO, "Hello World")