const PI = Math.PI;
const TOLERANCE = 0.000_001


function accuracyPassed(radians1: number, radians2: number): boolean {
	return (Math.abs(radians1 - radians2) < TOLERANCE)
}


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
		return accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians());
	}

	public isGreaterThan(other: Angle) {
		if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
			return false;
		}
		return this.getNormalizedAngleInRadians() > other.getNormalizedAngleInRadians();
	}

	public isLessThan(other: Angle) {
		if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
			return false;
		}
		return this.getNormalizedAngleInRadians() < other.getNormalizedAngleInRadians();
	}

	public isGreaterThanOrEqual(other: Angle) {
		if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
			return true;
		}
		return this.getNormalizedAngleInRadians() > other.getNormalizedAngleInRadians();
	}

	public isLessThanOrEqual(other: Angle) {
		if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
			return true;
		}
		return this.getNormalizedAngleInRadians() < other.getNormalizedAngleInRadians();
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

	public toString() { // python str()
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

	public mul(other: number): Angle {
		return Angle.fromRadians(this.radians * other)
	}

	public div(other: number): Angle {
		if (other == 0) {
			throw new Error("Zero division error")
		}
		return Angle.fromRadians(this.radians / other)
	}
}


class AngleRange {
	private readonly _startRad: Angle;
	private readonly _endRad: Angle;
	private readonly _abs: number;
	private readonly _normalizedAbs: number
	private readonly _startInclusive: boolean;
	private readonly _endInclusive: boolean;

	private constructor(
		start: Angle, end: Angle,
		startInclusive: boolean = false, endInclusive: boolean = false
	) {
		this._startRad = start;
		this._endRad = end;
		this._startInclusive = startInclusive;
		this._endInclusive = endInclusive;
		this._abs = Math.abs(this.start.radians - this.end.radians);
		this._normalizedAbs = Math.abs(this.start.getNormalizedAngleInRadians() - this.end.getNormalizedAngleInRadians());
	}

	public static fromAngle(
		start: Angle, end: Angle,
		startInclusive: boolean = false, endInclusive: boolean = false
	): AngleRange {
		return new AngleRange(start, end, startInclusive, endInclusive);
	}

	public static fromNumber(
		start: number, end: number,
		startInclusive: boolean = false, endInclusive: boolean = false
	): AngleRange {
		return new AngleRange(Angle.fromRadians(start), Angle.fromRadians(end), startInclusive, endInclusive);
	}

	private get start() { // may be public
		return this._startRad;
	}

	private get end() { // may be public
		return this._endRad;
	}

	private get startInclusive() { // may be public
		return this._startInclusive;
	}

	private get endInclusive() { // may be public
		return this._endInclusive;
	}

	public get abs(): number {
		return this._abs;
	}

	public get normalizedAbs(): number {
		return this._normalizedAbs;
	}

	private countBrackets(): number {
		let cnt = 0
		if (this._startInclusive) {
			cnt += 1
		}
		if (this._endInclusive) {
			cnt += 1
		}
		return cnt;
	}

    public toString() { // python str()
        return `start: ${this.start.toString()}, startInclusive: ${this.startInclusive}; end: ${this.end.toString()}, endInclusive: ${this.endInclusive}; abs: ${this.abs}`;
    }

    public representation() {
        return `start: ${this.start.representation()}, startInclusive: ${this.startInclusive}; end: ${this.end.representation()}, endInclusive: ${this.endInclusive}; abs: ${this.abs}`;
    }

	public isEquals(other: AngleRange) {
		return accuracyPassed(this.abs, other.abs) &&
			this.startInclusive == other.startInclusive &&
			this.endInclusive == other.endInclusive;
	}

    public isGreaterThan(other: AngleRange): boolean {
		if (accuracyPassed(this.normalizedAbs, other.normalizedAbs)) { // len is equals
			return this.countBrackets() > other.countBrackets();
		} else {
			return this.normalizedAbs > other.normalizedAbs;
		}
    }

    public isGreaterThanOrEqual(other: AngleRange): boolean {
		return this.isGreaterThan(other) || this.isEquals(other);
    }

	public isLessThan(other: AngleRange): boolean {
		return this.isLessThanOrEqual(other) && !this.isEquals(other);
	}

    public isLessThanOrEqual(other: AngleRange): boolean {
		return !this.isGreaterThan(other)
    }

	public contains(other: AngleRange | Angle): boolean {
		if (other instanceof AngleRange) {
			return this.contains(other.start) && this.contains(other.end);
		} else {
			if (accuracyPassed(this.start.radians, other.radians)) {
				return this._startInclusive;
			}

			if (accuracyPassed(this.end.radians, other.radians)) {
				return this._endInclusive;
			}

			if (this.start < this.end) {
				return other.radians > this.start.radians && other.radians < this.end.radians;
			} else {
				return other.radians < this.start.radians && other.radians > this.end.radians;
			}

		}
	}

	private isIntersect(other: AngleRange): boolean {
		return (this.contains(other.start) || this.contains(other.end) || other.contains(this.start))
	}

	public add(other: AngleRange): AngleRange[] {
		if (!this.isIntersect(other)) {
			return [this, other];
		}

		if (other.contains(this) || this.contains(other)) {
			return [this];
		}

		let newStart = this.start
		let newEnd = this.end

		if (this.contains(other.start)) {
			newEnd = other.end
		}

		if (other.contains(this.start)) {
			newStart = other.start
		}

		return [new AngleRange(newStart, newEnd, this.startInclusive || other.startInclusive, this.endInclusive || other.endInclusive)];
	}

	public sub(other: AngleRange): AngleRange[] {
		if (!this.isIntersect(other)) {
			return [this];
		}

		if (other.contains(this)) {
			return [];
		}

		if (this.contains(other.start) && this.contains(other.end)) {
			let r1 = new AngleRange(this.start, other.start, this.startInclusive, !other.startInclusive);
			let r2 = new AngleRange(other.end, this.end, !other.endInclusive, this.endInclusive);
			return [r1, r2]
		}

		if (other.contains(this.start)) {
			return [new AngleRange(other.end, this.end, !other.endInclusive, this.endInclusive)];
		}

		if (other.contains(this.end)) {
			return [new AngleRange(this.start, other.start, this.startInclusive, !other.startInclusive)];
		}

		return [this]
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
a1.angleRad = 2*PI
a2.angleRad = 20*PI

console.log("eq", a1.isEquals(a2))

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

const r1 = AngleRange.fromNumber(0.5, 0.7)
const r2 = AngleRange.fromNumber(0.5 + PI*2, 0.7 + PI*2)

console.log(r1.abs)
console.log(r2.abs)

console.log(r1.isEquals(r2))

console.log(r1.toString())
console.log(r1.representation())
