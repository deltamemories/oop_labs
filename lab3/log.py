from enum import Enum
from abc import ABC, abstractmethod


class LogLevel(Enum):
	DEBUG = 0
	INFO = 4
	WARNING = 8
	ERROR = 12


class ILogFilter(ABC):
	@abstractmethod
	def match(self, log_level: LogLevel, text: str) -> bool:
		pass


class ILogFormatter(ABC):
	pass


class ILogHandler(ABC):
	pass


class Logger:
	def __init__(
			self,
			filters: list[ILogFilter],
			formatters: list[ILogFormatter],
			handlers: list[ILogHandler]
	):
		pass

	def log(self, log_level: LogLevel, text: str) -> None:
		pass

	def log_info(self, text: str) -> None:
		pass

	def log_warn(self, text: str) -> None:
		pass

	def log_error(self, text: str) -> None:
		pass
