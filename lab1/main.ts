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

	public get radians() {
		return this._radians
	}
	public set angleRad(radians: number) {
		this._radians = radians;
	}
	public get degrees() {
		return this._radians / PI * 180
	}
	public set angleDeg(degrees: number) {
		this._radians = degrees * PI / 180
	}


	public isEquals(other: Angle) {
		return this.getNormalizedAngleInRadians() === other.getNormalizedAngleInRadians();
	}

	public isGreaterThan(other: Angle) {
		return this.getNormalizedAngleInRadians() > other.getNormalizedAngleInRadians();
	}

	public isLessThan(other: Angle) {
		return this.getNormalizedAngleInRadians() < other.getNormalizedAngleInRadians();
	}

	public isGreaterThanOrEqual(other: Angle) {
		return this.getNormalizedAngleInRadians() >= other.getNormalizedAngleInRadians();
	}

	public isLessThanOrEqual(other: Angle) {
		return this.getNormalizedAngleInRadians() <= other.getNormalizedAngleInRadians();
	}


}

const a1 = Angle.fromDegrees(450)
const a2 = Angle.fromRadians(PI/6)

console.log(a1)
console.log(a2)

console.log(a1.radians)
console.log(a1.degrees)

console.log(a1.getNormalizedAngleInRadians())
console.log(a2.getNormalizedAngleInRadians())

a1.angleRad = 3*PI
a2.angleDeg = 45

console.log(a1.radians)
console.log(a2.degrees)
a1.angleRad = PI
a2.angleRad = 1.5*PI

console.log(a1.isEquals(a2))

console.log(a1.degrees)
console.log(a2.degrees)

console.log(a1.isGreaterThan(a2))
console.log(a1.isLessThan(a2))

console.log(a1.isGreaterThanOrEqual(a2))
console.log(a1.isLessThanOrEqual(a2))
