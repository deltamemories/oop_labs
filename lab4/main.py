from abc import ABC, abstractmethod
from typing import TypeVar, Generic, List, Any

class EventArgs:
    pass

TEventArgs = TypeVar("TEventArgs", bound=EventArgs)

class EventHandler(ABC, Generic[TEventArgs]):
    @abstractmethod
    def handle(self, sender: Any, args: TEventArgs) -> None:
        pass

class Event(Generic[TEventArgs]):
    def __init__(self):
        self._handlers: List[EventHandler[TEventArgs]] = []

    def __iadd__(self, handler: EventHandler[TEventArgs]):
        if handler not in self._handlers:
            self._handlers.append(handler)
        return self

    def __isub__(self, handler: EventHandler[TEventArgs]):
        if handler in self._handlers:
            self._handlers.remove(handler)
        return self

    def invoke(self, sender: Any, args: TEventArgs) -> None:
        for handler in self._handlers:
            handler.handle(sender, args)

    def __call__(self, sender: Any, args: TEventArgs) -> None:
        self.invoke(sender, args)

class PropertyChangedEventArgs(EventArgs):
    def __init__(self, property_name: str):
        self.property_name = property_name

class PropertyChangingEventArgs(EventArgs):
    def __init__(self, property_name: str, old_value: Any, new_value: Any):
        self.property_name = property_name
        self.old_value = old_value
        self.new_value = new_value
        self.can_change = True

class ConsoleLogger(EventHandler[PropertyChangedEventArgs]):
    def handle(self, sender: Any, args: PropertyChangedEventArgs) -> None:
        print(f"[INFO] Property '{args.property_name}' was successfully changed in {sender.__class__.__name__} object.")

class StrictValidator(EventHandler[PropertyChangingEventArgs]):
    def handle(self, sender: Any, args: PropertyChangingEventArgs) -> None:
        print(f"[CHECK] Attempting to change '{args.property_name}' from '{args.old_value}' to '{args.new_value}'...")

        if isinstance(args.new_value, (int, float)) and args.new_value < 0:
            args.can_change = False
            print(f"   >>> [ERROR] Cancelled! Value cannot be negative.")
            return

        if isinstance(args.new_value, str) and len(args.new_value.strip()) == 0:
            args.can_change = False
            print(f"   >>> [ERROR] Cancelled! String cannot be empty.")
            return

        print("   >>> [OK] Validation passed.")

class BaseNotifyPropertyChanged:
    def __init__(self):
        self.property_changed = Event[PropertyChangedEventArgs]()
        self.property_changing = Event[PropertyChangingEventArgs]()

    def _set_property(self, name: str, current_value: Any, new_value: Any):
        args_changing = PropertyChangingEventArgs(name, current_value, new_value)
        self.property_changing.invoke(self, args_changing)

        if not args_changing.can_change:
            return current_value

        self.property_changed.invoke(self, PropertyChangedEventArgs(name))
        return new_value

class User(BaseNotifyPropertyChanged):
    def __init__(self, username: str, age: int, balance: float):
        super().__init__()
        self._username = username
        self._age = age
        self._balance = balance

    @property
    def username(self): return self._username
    @username.setter
    def username(self, value):
        self._username = self._set_property("username", self._username, value)

    @property
    def age(self): return self._age
    @age.setter
    def age(self, value):
        self._age = self._set_property("age", self._age, value)

    @property
    def balance(self): return self._balance
    @balance.setter
    def balance(self, value):
        self._balance = self._set_property("balance", self._balance, value)

class Product(BaseNotifyPropertyChanged):
    def __init__(self, title: str, price: float, stock_qty: int):
        super().__init__()
        self._title = title
        self._price = price
        self._stock_qty = stock_qty

    @property
    def title(self): return self._title
    @title.setter
    def title(self, value):
        self._title = self._set_property("title", self._title, value)

    @property
    def price(self): return self._price
    @price.setter
    def price(self, value):
        self._price = self._set_property("price", self._price, value)

    @property
    def stock_qty(self): return self._stock_qty
    @stock_qty.setter
    def stock_qty(self, value):
        self._stock_qty = self._set_property("stock_qty", self._stock_qty, value)

if __name__ == "__main__":
    logger = ConsoleLogger()
    validator = StrictValidator()

    user = User("Ivan", 25, 1000.0)
    user.property_changing += validator
    user.property_changed += logger

    print("1. Attempting to change age to 30:")
    user.age = 30
    print(f"Current age: {user.age}")

    print("\n2. Attempting to set negative balance:")
    user.balance = -500.0
    print(f"Current balance: {user.balance}")

    product = Product("Laptop", 1500.0, 5)
    product.property_changing += validator
    product.property_changed += logger

    print("\n3. Unsubscribing logger from product and changing price:")
    product.property_changed -= logger 
    
    product.price = 1400.0
    print(f"New price: {product.price}")
    
    print("\n4. Attempting to set empty title:")
    product.title = ""
    print(f"Product title: '{product.title}'")
      
