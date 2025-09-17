import math


class Angle:
	PI = math.pi
	def __init__(self, radians):
		self.angle_in_rad: float = radians

	@classmethod
	def from_degrees(cls, deg):
		return cls(deg*(Angle.PI/180))

	@staticmethod
	def get_normalized_angle(angle: float) -> float:
		"""
		:param angle: angle in radians
		:return: normalized angle in radians (0 <= angle <= 2*PI)
		"""
		if abs(angle) > 2*Angle.PI:
			k = math.trunc(angle / (2*Angle.PI))
			angle = angle - k*2*Angle.PI
			if angle < 0:
				return angle + 2*Angle.PI
			else:
				return angle



	# TODO string representation

	def __int__(self):
		return int(self.angle_in_rad)

	def __float__(self):
		return self.angle_in_rad


if __name__ == "__main__":
	angle = Angle(3)
	print(angle.angle_in_rad)
	print(angle.get_normalized_angle(10))
	print("==========")

	an2 = Angle.from_degrees(45)
	print(an2.angle_in_rad)
