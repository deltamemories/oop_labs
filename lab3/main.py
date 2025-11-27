from log import Logger, LevelFilter, Formatter, ConsoleHandler, LogLevel, FileLogHandler, SocketHandler

logger = Logger(
	filters=LevelFilter(LogLevel.DEBUG),
	formatters=Formatter(),
	handlers=[ConsoleHandler(), SocketHandler('localhost', 5000)],
)

logger.log(LogLevel.INFO, "Hello World")