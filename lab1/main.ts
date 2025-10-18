const PI = Math.PI;

class Angle {
	private _radians: number;

	private constructor(radians: number) {
		this._radians = radians;
	}

	public static fromRadians(radians: number): Angle {
		return new Angle(radians);
	}

	public static fromDegrees(degrees: number): Angle {
		const radians = degrees * PI / 180
		return new Angle(radians);
	}

	public getNormalizedAngleInRadians() {
		let normalizedAngleInRadians: number = this._radians % (PI*2);

		if (normalizedAngleInRadians < 0) {
			normalizedAngleInRadians += PI*2;
		}

		if (normalizedAngleInRadians === PI*2) {
			normalizedAngleInRadians = 0
		}
		return normalizedAngleInRadians
	}
}

const a1 = Angle.fromDegrees(450)
const a2 = Angle.fromRadians(PI/6)

console.log(a1)
console.log(a2)
console.log(a1.getNormalizedAngleInRadians())
console.log(a2.getNormalizedAngleInRadians())
