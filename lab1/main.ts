const PI = Math.PI;

class Angle {
	private _radians: number;

	private constructor(radians: number) {
		if (Number.isNaN(radians)) {
			throw new Error("radians is NaN");
		}
		this._radians = radians;
	}

	public static fromRadians(radians: number): Angle {
		return new Angle(radians);
	}

	public static fromDegrees(degrees: number): Angle {
		const radians = degrees * PI / 180
		return new Angle(radians);
	}

	private static fromString(radiansStr: string): Angle {
		const radians = Number(radiansStr);
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

	public getFloat() {
		return this._radians;
	}

	public getInt() {
		return Math.trunc(this._radians);
	}

	public getString() {
		return this._radians.toString()
	}

	public toString() {
		return `${this._radians} radians`;
	}

	public representation() {
		return `${this._radians} radians; ${this.degrees}°`;
	}

	private applyOperation(
		other: Angle | number | string,
		operation: (a: number, b: number) => number
	): Angle {
		if (other instanceof Angle) {
			return Angle.fromRadians(operation(this.radians, other.radians));
		} else if (typeof other === 'number') {
			return Angle.fromRadians(operation(this.radians, Angle.fromRadians(other).radians));
		} else {
			return Angle.fromRadians(operation(this.radians, Angle.fromString(other).radians));
		}
	}

	public add(other: Angle): Angle;

	public add(other: number): Angle;

	public add(other: string): Angle;

	public add(other: Angle | number | string): Angle {
		return this.applyOperation(other, (a, b) => a + b);
	}

	public sub(other: Angle): Angle;

	public sub(other: number): Angle;

	public sub(other: string): Angle;

	public sub(other: Angle | number | string): Angle {
		return this.applyOperation(other, (a, b) => a - b);
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

console.log(a1.getFloat())
console.log(a1.getInt())
console.log(a1.getString())

console.log(a1.toString())
console.log(a1.representation())


console.log(a1)
console.log(a1.add(a2))
console.log(a1.add(6))
console.log(a1.add('12'))

console.log(a1)
console.log(a1.sub(a2))
console.log(a1.sub(6))
console.log(a1.sub('12'))
