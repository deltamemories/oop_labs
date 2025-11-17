# lab2
# example: ConsolePrinter.print_static(text: str, color: Color, position: Tuple[int, int], symbol: str)
import json
import time
from enum import Enum


class ConsolePrinter:
	_FONT: dict[str, list[str]] = {}
	_FONT_HEIGHT : int
	_FONT_WIDTH : int
	_FONT_LOADED: bool = False
	_NEW_CANVAS: str = "\033[?1049h"
	_BACK_TO_OLD_CANVAS: str = "\033[?1049l"

	@staticmethod
	def _load_font(file_path: str) -> None:
		try:
			with open(file_path, "r", encoding="utf-8") as f:
				cfg = json.load(f)
				ConsolePrinter._FONT = cfg.get("letters", {})
				ConsolePrinter._FONT_WIDTH = cfg.get("font_width")
				ConsolePrinter._FONT_HEIGHT = cfg.get("font_height")
				ConsolePrinter._FONT_LOADED = True
		except FileNotFoundError as e:
			raise e
		except json.JSONDecodeError as e:
			raise e
		except Exception as e:
			raise e

	def __init__(self, path_to_font_config, color: AnsiColors, position: tuple[int, int], symbol: str):
		if not ConsolePrinter._FONT_LOADED:
			ConsolePrinter._load_font(path_to_font_config)

		self._path_to_font_config = path_to_font_config
		self._color = color
		self._position = position
		self._symbol = symbol
		self.new_canvas()

	@staticmethod
	def new_canvas():
		print(ConsolePrinter._NEW_CANVAS, end='', flush=True)

	@staticmethod
	def close_canvas():
		print(ConsolePrinter._BACK_TO_OLD_CANVAS, end='', flush=True)

	def __enter__(self):
		self.new_canvas()
		return self

	def __exit__(self, exc_type, exc_val, exc_tb):
		self.close_canvas()

	@staticmethod
	def draw_pixel(row: int, col: int, color: AnsiColors, symbol: str):
		pos = f"\033[{row+1};{col+1}H"
		print(f"{color.value}{pos}{symbol}{AnsiColors.RESET.value}", end='', flush=True)

	@classmethod
	def print_letter(cls, letter: str, position: tuple[int, int], color: AnsiColors, symbol: str) -> None:
		char_template = ConsolePrinter._FONT.get(letter, [])
		row, col = position
		for i, line in enumerate(char_template):
			for j, char in enumerate(line):
				if char == "*":
					cls.draw_pixel(row + i, col + j, color, symbol)
				else:
					cls.draw_pixel(row + i, col + j, AnsiColors.BLACK, ' ')

	def print(
			self,
			text: str,
			position: tuple[int, int] | None = None,
			color: AnsiColors | None = None,
			symbol: str | None = None
	):
		"""
		:param text: text to print
		:param position: (row, column)
		:param color: ANSI color
		:param symbol: one character
		"""
		if position is None:
			position = self._position
		if color is None:
			color = self._color
		if symbol is None:
			symbol = self._symbol

		for i, letter in enumerate(text.lower()):
			pos = (position[0], position[1] + i * (ConsolePrinter._FONT_WIDTH + 1))
			self.print_letter(letter, pos, color, symbol)

	@classmethod
	def print_static(
			cls,
			text: str,
			position: tuple[int, int] | None = None,
			color: AnsiColors | None = None,
			symbol: str | None = None
	) -> None:
		for i, letter in enumerate(text.lower()):
			pos = (position[0], position[1] + i * (ConsolePrinter._FONT_WIDTH + 1))
			cls.print_letter(letter, pos, color, symbol)


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


p = ConsolePrinter('fontConfig.json', AnsiColors.BRIGHT_YELLOW, (10, 10), '*')
p.print('hello world!')
time.sleep(2)
p.close_canvas()


with ConsolePrinter('fontConfig.json', AnsiColors.BRIGHT_WHITE, (10, 10), '*') as p:
	p.print('012345679')
	time.sleep(200)