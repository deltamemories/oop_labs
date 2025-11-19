# lab2
import json
import time
from enum import Enum


class ConsolePrinter:
	_NEW_CANVAS: str = "\033[?1049h"
	_BACK_TO_OLD_CANVAS: str = "\033[?1049l"

	def __init__(self, path_to_font_config, color: AnsiColors, position: tuple[int, int], symbol: str):
		self._font = None
		self._font_width = None
		self._font_height = None
		self._load_font(path_to_font_config)
		self._color = color
		self._position = position
		self._symbol = symbol
		self.new_canvas()

	def _load_font(self, file_path: str) -> None:
		try:
			with open(file_path, "r", encoding="utf-8") as f:
				cfg = json.load(f)
				self._font = cfg.get("letters", {})
				self._font_width = cfg.get("font_width")
				self._font_height = cfg.get("font_height")
		except FileNotFoundError as e:
			raise e
		except json.JSONDecodeError as e:
			raise e
		except Exception as e:
			raise e

	@staticmethod
	def new_canvas() -> None:
		print(ConsolePrinter._NEW_CANVAS, end='', flush=True)

	@staticmethod
	def close_canvas() -> None:
		print(ConsolePrinter._BACK_TO_OLD_CANVAS, end='', flush=True)

	def __enter__(self):
		self.new_canvas()
		return self

	def __exit__(self, exc_type, exc_val, exc_tb):
		self.close_canvas()

	@staticmethod
	def _draw_pixel(row: int, col: int, color: AnsiColors, symbol: str):
		pos = f"\033[{row+1};{col+1}H"
		print(f"{color.value}{pos}{symbol}{AnsiColors.RESET.value}", end='', flush=True)

	def _print_letter(self, letter: str, position: tuple[int, int], color: AnsiColors, symbol: str) -> None:
		char_template = self._font.get(letter, [])
		row, col = position
		for i, line in enumerate(char_template):
			for j, char in enumerate(line):
				if char == "*":
					self._draw_pixel(row + i, col + j, color, symbol)
				else:
					self._draw_pixel(row + i, col + j, AnsiColors.BLACK, ' ')

	def print(
			self,
			text: str,
			color: AnsiColors | None = None,
			position: tuple[int, int] | None = None,
			symbol: str | None = None
	):
		"""
		:param text: text to print
		:param color: ANSI color
		:param position: (row, column)
		:param symbol: the symbol that will be used to display the text (only one character)
		"""
		if position is None:
			position = self._position
		if color is None:
			color = self._color
		if symbol is None:
			symbol = self._symbol

		if len(symbol) != 1:
			raise ValueError("Symbol must be a single character")

		i, j = 0, 0
		for letter in text:
			if letter == '\n':
				j += 1
				i = 0
				continue

			pos = (position[0] + j * (self._font_height + 1), position[1] + i * (self._font_width + 1))
			self._print_letter(letter, pos, color, symbol)
			i += 1

	@classmethod
	def print_static(
			cls,
			path_to_font_config: str,
			text: str,
			color: AnsiColors,
			position: tuple[int, int],
			symbol: str
	) -> None:
		"""
		:param path_to_font_config: path to config with font
		:param text: text to print
		:param color: ANSI color
		:param position: (row, column)
		:param symbol: the symbol that will be used to display the text (only one character)
		"""
		printer = cls(path_to_font_config, color, position, symbol)
		printer.print(text)

	@classmethod
	def close_canvas_static(cls):
		cls.close_canvas()


class AnsiColors(Enum):
	RESET = "\033[0m"

	BLACK = "\033[30m"
	RED = "\033[31m"
	GREEN = "\033[32m"
	YELLOW = "\033[33m"
	BLUE = "\033[34m"
	MAGENTA = "\033[35m"
	CYAN = "\033[36m"
	WHITE = "\033[37m"

	BRIGHT_BLACK = "\033[90m"
	BRIGHT_RED = "\033[91m"
	BRIGHT_GREEN = "\033[92m"
	BRIGHT_YELLOW = "\033[93m"
	BRIGHT_BLUE = "\033[94m"
	BRIGHT_MAGENTA = "\033[95m"
	BRIGHT_CYAN = "\033[96m"
	BRIGHT_WHITE = "\033[97m"

	BG_BLACK = "\033[40m"
	BG_RED = "\033[41m"


with ConsolePrinter('fontConfig.json', AnsiColors.BRIGHT_WHITE, (10, 10), '*') as p:
	p.print('012345679')
	time.sleep(2)

ConsolePrinter.print_static('fontConfig.json', '!@#$%^&*()_+-/', AnsiColors.BRIGHT_YELLOW, (10, 10), '*')
time.sleep(2)
ConsolePrinter.close_canvas_static()

with ConsolePrinter('fontConfig.json', AnsiColors.BRIGHT_CYAN, (10, 10), '*') as p:
	p.print('привет мир!')
	time.sleep(2)

with ConsolePrinter('fontConfig_3x5.json', AnsiColors.BRIGHT_CYAN, (10, 10), '*') as p:
	p.print('hello world')
	time.sleep(2)

with ConsolePrinter('fontConfig_7x11.json', AnsiColors.BRIGHT_CYAN, (0, 0), '*') as p:
	p.print('hello\nworld')
	time.sleep(2)
