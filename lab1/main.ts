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
}

const a1 = Angle.fromDegrees(90)
const a2 = Angle.fromRadians(PI/6)

console.log(a1)
console.log(a2)
