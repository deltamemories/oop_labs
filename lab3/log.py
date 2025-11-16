import datetime
import re
from abc import ABC, abstractmethod
from enum import Enum


class LogLevel(Enum):
	DEBUG = 0
	INFO = 4
	WARNING = 8
	ERROR = 12


class ILogFilter(ABC):
	@abstractmethod
	def match(self, log_level: LogLevel, text: str) -> bool:
		pass

class SimpleLogFilter(ILogFilter):
	def __init__(self, pattern: str):
		self._pattern = pattern

	def match(self, log_level: LogLevel, text: str) -> bool:
		return self._pattern in text

class ReLLogFilter(ILogFilter):
	def __init__(self, re_pattern: str):
		self._re_pattern = re_pattern

	def match(self, log_level: LogLevel, text: str) -> bool:
		return re.match(self._re_pattern, text) is not None

class LevelFilter(ILogFilter):
	def __init__(self, level: LogLevel):
		self._level = level

	def match(self, log_level: LogLevel, text: str) -> bool:
		return log_level.value >= self._level.value


class ILogHandler(ABC):
	@abstractmethod
	def handle(self, log_level: LogLevel, text: str) -> None:
		pass

class FileLogHandler(ILogHandler):
	def __init__(self, file_path: str):
		self._file_path = file_path
		self._file_descriptor = None
		try:
			f = open(self._file_path, "a")
		except FileNotFoundError as e:
			raise e
		except PermissionError as e:
			raise e
		except Exception as e:
			raise e
		else:
			self._file_descriptor = f

	def __del__(self):
		if self._file_descriptor is not None:
			self._file_descriptor.close()

	def handle(self, log_level: LogLevel, text: str) -> None:
		print(f"{log_level.value}: {text}", file=self._file_descriptor)


class SocketHandler(ILogHandler):
	def handle(self, log_level: LogLevel, text: str) -> None:
		pass # TODO SocketHandler.handle

class ConsoleHandler(ILogHandler):
	def handle(self, log_level: LogLevel, text: str) -> None:
		print(text)

class SysLogHandler(ILogHandler):
	def handle(self, log_level: LogLevel, text: str) -> None:
		pass # TODO SysLogHandler.handle

class FtpHandler(ILogHandler):
	def handle(self, log_level: LogLevel, text: str) -> None:
		pass # TODO FtpHandler.handle


class ILogFormatter(ABC):
	@abstractmethod
	def format(self, log_level: LogLevel, text: str) -> str:
		pass


class Formatter(ILogFormatter):
	def format(self, log_level: LogLevel, text: str) -> str:
		return f"[{log_level.name}] [{datetime.datetime.now()}] {text}" # TODO make in data:yyyy.MM.dd hh:mm:ss format


class Logger:
	def __init__(
			self,
			filters: list[ILogFilter] | ILogFilter,
			formatters: list[ILogFormatter] | ILogFormatter,
			handlers: list[ILogHandler] | ILogHandler,
	):
		if type(filters) is not list:
			filters = [filters]
		if type(formatters) is not list:
			formatters = [formatters]
		if type(handlers) is not list:
			handlers = [handlers]
		self._filters = filters
		self._formatters = formatters
		self._handlers = handlers

	def _log(self, log_level: LogLevel, text: str) -> None:
		if all([filter.match(log_level, text) for filter in self._filters]):
			for formatter in self._formatters:
				text = formatter.format(log_level, text)
			for handler in self._handlers:
				handler.handle(log_level, text)

	def log(self, log_level: LogLevel, text: str) -> None:
		self._log(log_level, text)

	def log_info(self, text: str) -> None:
		self.log(LogLevel.INFO, text)

	def log_warn(self, text: str) -> None:
		self.log(LogLevel.WARNING, text)

	def log_error(self, text: str) -> None:
		self.log(LogLevel.ERROR, text)
