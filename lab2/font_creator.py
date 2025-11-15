import json

from PIL import Image
import string

def parse(img_path: str, letter_width: int, alphabet: list[str], letters_gap=1) -> dict[str, list[str]]:
	# from left to right
	# then from top to bottom

	answer: dict[str, list[str]] = dict()
	with Image.open(img_path) as img:
		width, height = img.size

		width_shift = 0
		for letter in alphabet:
			answer.update({letter: []})

			for y in range(height):
				letter_line: list[str] = []
				for x in range(width_shift, letter_width + width_shift):
					pixel_rgba = img.getpixel((x, y))
					if pixel_rgba == (0, 0, 0, 255):
						letter_line.append('*')
					else:
						letter_line.append('_')
				answer[letter].append("".join(letter_line))

			width_shift += letter_width + letters_gap

	return answer



alphabet = list(string.ascii_lowercase)
a = parse('5x7_letters.png', 5, alphabet, 1)
print(a)
print(json.dumps(a))

