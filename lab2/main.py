# lab2
# example: ConsolePrinter.print_static(text: str, color: Color, position: Tuple[int, int], symbol: str)
import json
import time
from enum import Enum


class ConsolePrinter:
	_FONT: dict[str, list[str]] = {}
	_FONT_LOADED: bool = False

	@staticmethod
	def _load_font(file_path: str) -> None:
		try:
			with open(file_path, "r", encoding="utf-8") as f:
				ConsolePrinter._FONT = json.load(f)
				ConsolePrinter._FONT_LOADED = True
		except FileNotFoundError as e:
			pass # TODO
		except json.JSONDecodeError as e:
			pass # TODO
		except Exception as e:
			raise e

	def __init__(self, path_to_font_config, color: AnsiColors, position: tuple[int, int], symbol: str):
		if not ConsolePrinter._FONT_LOADED:
			return # TODO TMP
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


	@classmethod
	def print_static(cls):
		pass

	def print(self, text: str, color: AnsiColors, position: tuple[int, int], symbol: str):
		pass


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


p = ConsolePrinter(None, None, None, None)
print("\033[?1049h", end='', flush=True)

p.draw_char(0, 0, ["__*__", "__*__", "_*_*_", "_*_*_", "*****", "*___*", "*___*"], AnsiColors.RED, symbol='*')
p.draw_char(0, 7, ["***__", "*__*_", "***__", "*____", "****_", "*___*", "*****"], AnsiColors.RED, symbol='*')
p.draw_char(0, 14, ["****_", "*____", "*____", "*____", "*____", "*____", "****_"], AnsiColors.RED, symbol='*')


time.sleep(5)
print("\033[?1049l", end='', flush=True)

