from log import Logger, LevelFilter, Formatter, ConsoleHandler, LogLevel

logger = Logger(
	filters=LevelFilter(LogLevel.DEBUG),
	formatters=Formatter(),
	handlers=ConsoleHandler()
)
logger.log(LogLevel.INFO, "Hello World")