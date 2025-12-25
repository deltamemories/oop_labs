import abc
import json
import os
from typing import List, Dict, Any, Optional


class Logger:
	_instance = None
	LOG_FILE = "output_log.log"

	def __new__(cls):
		if cls._instance is None:
			cls._instance = super(Logger, cls).__new__(cls)

			with open(cls.LOG_FILE, "w", encoding="utf-8") as f:
				f.write("--- Log Started ---\n")
		return cls._instance

	def log(self, message: str):
		print(message)

		with open(self.LOG_FILE, "a", encoding="utf-8") as f:
			f.write(message + "\n")


logger = Logger()


class TextEngine:
	def __init__(self):
		self._content = []

	def add_char(self, char: str):
		self._content.append(char)
		self._print_state()

	def remove_last(self):
		if self._content:
			self._content.pop()
		self._print_state()

	def get_text(self) -> str:
		return "".join(self._content)

	def _print_state(self):
		logger.log(f"Current Text: {self.get_text()}")


class ICommand(abc.ABC):
	@abc.abstractmethod
	def execute(self):
		pass

	@abc.abstractmethod
	def undo(self):
		pass

	@abc.abstractmethod
	def get_name(self) -> str:
		pass


class TypeCharCommand(ICommand):
	def __init__(self, _text_engine: TextEngine, char: str):
		self._text_engine = _text_engine
		self._char = char

	def execute(self):
		self._text_engine.add_char(self._char)

	def undo(self):
		self._text_engine.remove_last()

	def get_name(self) -> str:
		return f"TypeChar:{self._char}"


class VolumeUpCommand(ICommand):
	def execute(self):
		logger.log("VOLUME: Increased +20%")

	def undo(self):
		logger.log("VOLUME: Decreased +20% (Undo)")

	def get_name(self) -> str:
		return "VolumeUp"


class VolumeDownCommand(ICommand):
	def execute(self):
		logger.log("VOLUME: Decreased -20%")

	def undo(self):
		logger.log("VOLUME: Increased +20% (Undo)")

	def get_name(self) -> str:
		return "VolumeDown"


class MediaPlayerCommand(ICommand):
	def execute(self):
		logger.log("MEDIA: Player Launched")

	def undo(self):
		logger.log("MEDIA: Player Closed (Undo)")

	def get_name(self) -> str:
		return "MediaPlayer"


class ObjectConverter:
	def __init__(self, rename_map: Dict[str, str] = None, exclude_fields: List[str] = None):
		self.rename_map = rename_map or {}
		self.exclude_fields = exclude_fields or []

	def to_dict(self, obj: Any) -> Dict[str, Any]:
		result = {}
		source = obj if isinstance(obj, dict) else obj.__dict__

		for key, value in source.items():
			if key in self.exclude_fields:
				continue
			new_key = self.rename_map.get(key, key)
			result[new_key] = value
		return result


class JsonSerializer:
	@staticmethod
	def save(data: Dict, filename: str):
		try:
			with open(filename, 'w', encoding='utf-8') as f:
				json.dump(data, f, indent=4)
			logger.log(f"SYSTEM: Config saved to {filename}")
		except Exception as e:
			logger.log(f"ERROR: Could not save file - {e}")

	@staticmethod
	def load(filename: str) -> Optional[Dict]:
		if not os.path.exists(filename):
			return None
		try:
			with open(filename, 'r', encoding='utf-8') as f:
				return json.load(f)
		except Exception as e:
			logger.log(f"ERROR: Could not load file - {e}")
			return None


class VirtualKeyboard:
	def __init__(self, _text_engine: TextEngine):
		self._bindings: Dict[str, ICommand] = {}
		self._history: List[ICommand] = []
		self._redo_stack: List[ICommand] = []
		self._text_engine = _text_engine

	def register_key(self, key_combination: str, command: ICommand):
		self._bindings[key_combination] = command
		logger.log(f"KEYBOARD: Mapped '{key_combination}' to {command.get_name()}")

	def press_key(self, key_combination: str):
		if key_combination in self._bindings:
			command = self._bindings[key_combination]

			logger.log(f"> Pressed: {key_combination}")

			command.execute()
			self._history.append(command)
			self._redo_stack.clear()
		else:
			logger.log(f"KEYBOARD: Key '{key_combination}' is not bound.")

	def undo(self):
		if not self._history:
			logger.log("KEYBOARD: Nothing to undo.")
			return

		command = self._history.pop()
		logger.log("> Undo")
		command.undo()
		self._redo_stack.append(command)

	def redo(self):
		if not self._redo_stack:
			logger.log("KEYBOARD: Nothing to redo.")
			return

		command = self._redo_stack.pop()
		logger.log("> Redo")
		command.execute()
		self._history.append(command)

	def get_bindings(self) -> Dict[str, ICommand]:
		return self._bindings


class KeyboardStateSaver:
	def __init__(self, _text_engine: TextEngine):
		self.filename = "keyboard_config.json"
		self._text_engine = _text_engine
		self.converter = ObjectConverter()

	def save_state(self, _keyboard: VirtualKeyboard):
		raw_bindings = _keyboard.get_bindings()
		serializable_data = {}

		for key, cmd in raw_bindings.items():
			cmd_data = {"type": cmd.__class__.__name__}

			if isinstance(cmd, TypeCharCommand):
				cmd_data["char"] = cmd._char

			serializable_data[key] = cmd_data

		JsonSerializer.save(serializable_data, self.filename)

	def restore_state(self, _keyboard: VirtualKeyboard):
		data = JsonSerializer.load(self.filename)
		if not data:
			logger.log("SYSTEM: No saved config found. Using defaults.")
			return

		logger.log("SYSTEM: Restoring configuration...")

		for key, info in data.items():
			cmd_type = info.get("type")
			command = None

			if cmd_type == "TypeCharCommand":
				char = info.get("char", "")
				command = TypeCharCommand(self._text_engine, char)
			elif cmd_type == "VolumeUpCommand":
				command = VolumeUpCommand()
			elif cmd_type == "VolumeDownCommand":
				command = VolumeDownCommand()
			elif cmd_type == "MediaPlayerCommand":
				command = MediaPlayerCommand()

			if command:
				_keyboard.register_key(key, command)


if __name__ == "__main__":
	text_engine = TextEngine()
	keyboard = VirtualKeyboard(text_engine)
	saver = KeyboardStateSaver(text_engine)

	saver.restore_state(keyboard)

	if not keyboard.get_bindings():
		logger.log("SYSTEM: Setting default bindings.")

		keyboard.register_key("a", TypeCharCommand(text_engine, "a"))
		keyboard.register_key("b", TypeCharCommand(text_engine, "b"))
		keyboard.register_key("c", TypeCharCommand(text_engine, "c"))
		keyboard.register_key("d", TypeCharCommand(text_engine, "d"))

		keyboard.register_key("ctrl++", VolumeUpCommand())
		keyboard.register_key("ctrl+-", VolumeDownCommand())
		keyboard.register_key("ctrl+p", MediaPlayerCommand())

	logger.log("--- Start of Interaction ---")


	keyboard.press_key("a")
	keyboard.press_key("b")
	keyboard.press_key("c")

	keyboard.undo()  # undo 'c'
	keyboard.undo()  # undo 'b'

	keyboard.redo()  # redo 'b'

	keyboard.press_key("ctrl++")
	keyboard.press_key("ctrl+-")
	keyboard.press_key("ctrl+p")

	keyboard.press_key("d")

	keyboard.undo()
	keyboard.undo()

	saver.save_state(keyboard)
	logger.log("--- End of Interaction ---")