# lab2
# example: ConsolePrinter.print(text: str, color: Color, position: Tuple[int, int], symbol: str)
from enum import Enum

class ConsolePrinter:
	def __init__(self, path_to_font_config):
		pass

	def print(self, text: str, color: AnsiColors, position: tuple[int, int]):
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




# Пример использования:

print(f"{AnsiColors.RED.value}Это красный текст."
			f"{AnsiColors.RESET.value} А это снова обычный текст по умолчанию.")

print(f"{AnsiColors.BRIGHT_GREEN.value}Яркий зеленый текст."
			f"{AnsiColors.RESET.value}")

