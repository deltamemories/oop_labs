# lab2
# example: ConsolePrinter.print_static(text: str, color: Color, position: Tuple[int, int], symbol: str)
import json
import string
import time
from enum import Enum


class ConsolePrinter:
	_FONT: dict[str, list[str]] = {}
	_FONT_HEIGHT : int
	_FONT_WIDTH : int
	_FONT_LOADED: bool = False

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
			pass # TODO
		except json.JSONDecodeError as e:
			pass # TODO
		except Exception as e:
			raise e

	def __init__(self, path_to_font_config, color: AnsiColors, position: tuple[int, int], symbol: str):
		if not ConsolePrinter._FONT_LOADED:
			ConsolePrinter._load_font(path_to_font_config)

		self._path_to_font_config = path_to_font_config
		self._color = color
		self._position = position
		self._symbol = symbol


	@staticmethod
	def draw_pixel(row: int, col: int, color: AnsiColors, symbol: str):
		pos = f"\033[{row+1};{col+1}H"

		print(f"{color.value}{pos}{symbol}{AnsiColors.RESET.value}", end='', flush=True)

	@staticmethod
	def draw_char(row: int, col: int, char_template: list[str], color: AnsiColors, symbol: str, ):
		for i, line in enumerate(char_template):
			for j, char in enumerate(line):
				if char == "*":
					ConsolePrinter.draw_pixel(row+i, col+j, color, symbol)
				else:
					ConsolePrinter.draw_pixel(row+i, col+j, AnsiColors.BLACK, ' ')


	@classmethod
	def print_static(cls):
		pass

	def print_letter(self, letter: str, position: tuple[int, int], color: AnsiColors, symbol: str):
		char_template = ConsolePrinter._FONT.get(letter, [])
		self.draw_char(position[0], position[1], char_template, color, symbol)

	def print(self, text: str, position: tuple[int, int], color: AnsiColors, symbol: str):
		"""
		:param text:
		:param position: (row, column)
		:param color: ANSI color
		:param symbol: one character
		"""
		print("\033[?1049l", end='', flush=True) # TODO for test
		for i, letter in enumerate(text.lower()):
			pos = (position[0], position[1] + i * (ConsolePrinter._FONT_WIDTH + 1))
			self.print_letter(letter, pos, color, symbol)

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


p = ConsolePrinter('fontConfig.json', None, None, None)

print("\033[?1049h", end='', flush=True) # new canvas

# p.draw_char(0, 0, ["__*__", "__*__", "_*_*_", "_*_*_", "*****", "*___*", "*___*"], AnsiColors.RED, symbol='*')
# p.draw_char(0, 7, ["***__", "*__*_", "***__", "*____", "****_", "*___*", "*****"], AnsiColors.RED, symbol='*')
# p.draw_char(0, 14, ["****_", "*____", "*____", "*____", "*____", "*____", "****_"], AnsiColors.RED, symbol='*')




# i = 0
# j = 0
# d = [
# 	AnsiColors.BRIGHT_RED,
# 	AnsiColors.BRIGHT_GREEN,
# 	AnsiColors.BRIGHT_YELLOW,
# 	AnsiColors.BRIGHT_BLUE,
# 	AnsiColors.BRIGHT_MAGENTA,
# 	AnsiColors.BRIGHT_CYAN,
# 	AnsiColors.BRIGHT_WHITE,
# ]
#
# while True:
# 	try:
# 		if i == len(string.ascii_lowercase):
# 			i = 0
# 			j += 1
# 			if j == len(d):
# 				j = 0
#
# 		l = string.ascii_lowercase[i]
# 		p.print_letter(l,(0, i*7), d[j], '#')
# 		time.sleep(0.008)
# 		i = i + 1
# 	except KeyboardInterrupt:
# 		print("\033[?1049l", end='', flush=True)  # back to old canvas
# 		quit(0)

p.print('hello world', (10, 10), AnsiColors.BRIGHT_YELLOW, '#')


time.sleep(2)
print("\033[?1049l", end='', flush=True) # back to old canvas

