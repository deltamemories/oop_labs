var PI = Math.PI;
var TOLERANCE = 0.000001;
function accuracyPassed(radians1, radians2) {
    return (Math.abs(radians1 - radians2) < TOLERANCE);
}
var Angle = /** @class */ (function () {
    function Angle(radians) {
        if (Number.isNaN(radians)) {
            throw new Error("radians is NaN");
        }
        this._radians = radians;
    }
    Angle.fromRadians = function (radians) {
        return new Angle(radians);
    };
    Angle.fromDegrees = function (degrees) {
        var radians = degrees * PI / 180;
        return new Angle(radians);
    };
    Angle.fromString = function (radiansStr) {
        var radians = Number(radiansStr);
        return new Angle(radians);
    };
    Angle.prototype.getNormalizedAngleInRadians = function () {
        var normalizedAngleInRadians = this._radians % (PI * 2);
        if (normalizedAngleInRadians < 0) {
            normalizedAngleInRadians += PI * 2;
        }
        if (normalizedAngleInRadians === PI * 2) {
            normalizedAngleInRadians = 0;
        }
        return normalizedAngleInRadians;
    };
    Object.defineProperty(Angle.prototype, "radians", {
        get: function () {
            return this._radians;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "angleRad", {
        set: function (radians) {
            this._radians = radians;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "degrees", {
        get: function () {
            return this._radians / PI * 180;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "angleDeg", {
        set: function (degrees) {
            this._radians = degrees * PI / 180;
        },
        enumerable: false,
        configurable: true
    });
    Angle.prototype.isEquals = function (other) {
        return accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians());
    };
    Angle.prototype.isGreaterThan = function (other) {
        if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
            return false;
        }
        return this.getNormalizedAngleInRadians() > other.getNormalizedAngleInRadians();
    };
    Angle.prototype.isLessThan = function (other) {
        if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
            return false;
        }
        return this.getNormalizedAngleInRadians() < other.getNormalizedAngleInRadians();
    };
    Angle.prototype.isGreaterThanOrEqual = function (other) {
        if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
            return true;
        }
        return this.getNormalizedAngleInRadians() > other.getNormalizedAngleInRadians();
    };
    Angle.prototype.isLessThanOrEqual = function (other) {
        if (accuracyPassed(this.getNormalizedAngleInRadians(), other.getNormalizedAngleInRadians())) {
            return true;
        }
        return this.getNormalizedAngleInRadians() < other.getNormalizedAngleInRadians();
    };
    Angle.prototype.getFloat = function () {
        return this._radians;
    };
    Angle.prototype.getInt = function () {
        return Math.trunc(this._radians);
    };
    Angle.prototype.getString = function () {
        return this._radians.toString();
    };
    Angle.prototype.toString = function () {
        return "".concat(this._radians, " radians");
    };
    Angle.prototype.representation = function () {
        return "".concat(this._radians, " radians; ").concat(this.degrees, "\u00B0");
    };
    Angle.prototype.applyOperation = function (other, operation) {
        if (other instanceof Angle) {
            return Angle.fromRadians(operation(this.radians, other.radians));
        }
        else if (typeof other === 'number') {
            return Angle.fromRadians(operation(this.radians, Angle.fromRadians(other).radians));
        }
        else {
            return Angle.fromRadians(operation(this.radians, Angle.fromString(other).radians));
        }
    };
    Angle.prototype.add = function (other) {
        return this.applyOperation(other, function (a, b) { return a + b; });
    };
    Angle.prototype.sub = function (other) {
        return this.applyOperation(other, function (a, b) { return a - b; });
    };
    Angle.prototype.mul = function (other) {
        return Angle.fromRadians(this.radians * other);
    };
    Angle.prototype.div = function (other) {
        if (other == 0) {
            throw new Error("Zero division error");
        }
        return Angle.fromRadians(this.radians / other);
    };
    return Angle;
}());
var AngleRange = /** @class */ (function () {
    function AngleRange(start, end, startInclusive, endInclusive) {
        if (startInclusive === void 0) { startInclusive = false; }
        if (endInclusive === void 0) { endInclusive = false; }
        this._startRad = start;
        this._endRad = end;
        this._startInclusive = startInclusive;
        this._endInclusive = endInclusive;
        this._abs = this.angularLength;
        this._normalizedAbs = Math.abs(this.start.getNormalizedAngleInRadians() - this.end.getNormalizedAngleInRadians());
    }
    AngleRange.fromAngle = function (start, end, startInclusive, endInclusive) {
        if (startInclusive === void 0) { startInclusive = false; }
        if (endInclusive === void 0) { endInclusive = false; }
        return new AngleRange(start, end, startInclusive, endInclusive);
    };
    AngleRange.fromNumber = function (start, end, startInclusive, endInclusive) {
        if (startInclusive === void 0) { startInclusive = false; }
        if (endInclusive === void 0) { endInclusive = false; }
        return new AngleRange(Angle.fromRadians(start), Angle.fromRadians(end), startInclusive, endInclusive);
    };
    Object.defineProperty(AngleRange.prototype, "angularLength", {
        get: function () {
            var s = this.start.getNormalizedAngleInRadians();
            var e = this.end.getNormalizedAngleInRadians();
            if (e >= s) {
                return e - s;
            }
            else {
                return (2 * PI - s) + e;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AngleRange.prototype, "start", {
        get: function () {
            return this._startRad;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AngleRange.prototype, "end", {
        get: function () {
            return this._endRad;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AngleRange.prototype, "startInclusive", {
        get: function () {
            return this._startInclusive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AngleRange.prototype, "endInclusive", {
        get: function () {
            return this._endInclusive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AngleRange.prototype, "abs", {
        get: function () {
            return this._abs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AngleRange.prototype, "normalizedAbs", {
        get: function () {
            return this._normalizedAbs;
        },
        enumerable: false,
        configurable: true
    });
    AngleRange.prototype.countBrackets = function () {
        var cnt = 0;
        if (this._startInclusive) {
            cnt += 1;
        }
        if (this._endInclusive) {
            cnt += 1;
        }
        return cnt;
    };
    AngleRange.prototype.toString = function () {
        var leftBracket = this._startInclusive ? '[' : '(';
        var rightBracket = this._endInclusive ? ']' : ')';
        return "".concat(leftBracket).concat(this.start.radians, ", ").concat(this.end.radians).concat(rightBracket);
    };
    AngleRange.prototype.representation = function () {
        return "start: ".concat(this.start.representation(), ", startInclusive: ").concat(this.startInclusive, "; end: ").concat(this.end.representation(), ", endInclusive: ").concat(this.endInclusive, "; abs: ").concat(this.abs);
    };
    AngleRange.prototype.isEquals = function (other) {
        return this.start.isEquals(other.start) &&
            this.end.isEquals(other.end) &&
            this.startInclusive === other.startInclusive &&
            this.endInclusive === other.endInclusive;
    };
    AngleRange.prototype.isGreaterThan = function (other) {
        if (accuracyPassed(this.normalizedAbs, other.normalizedAbs)) { // len is equals
            return this.countBrackets() > other.countBrackets();
        }
        else {
            return this.normalizedAbs > other.normalizedAbs;
        }
    };
    AngleRange.prototype.isGreaterThanOrEqual = function (other) {
        return this.isGreaterThan(other) || this.isEquals(other);
    };
    AngleRange.prototype.isLessThan = function (other) {
        return this.isLessThanOrEqual(other) && !this.isEquals(other);
    };
    AngleRange.prototype.isLessThanOrEqual = function (other) {
        return !this.isGreaterThan(other);
    };
    AngleRange.prototype.contains = function (other) {
        if (other instanceof AngleRange) {
            return this.contains(other.start) && this.contains(other.end);
        }
        else {
            if (accuracyPassed(this.start.radians, other.radians)) {
                return this._startInclusive;
            }
            if (accuracyPassed(this.end.radians, other.radians)) {
                return this._endInclusive;
            }
            if (this.start.radians < this.end.radians) {
                return other.radians > this.start.radians && other.radians < this.end.radians;
            }
            else {
                return other.radians < this.start.radians && other.radians > this.end.radians;
            }
        }
    };
    AngleRange.prototype.isIntersect = function (other) {
        return (this.contains(other.start) || this.contains(other.end) || other.contains(this.start));
    };
    AngleRange.prototype.add = function (other) {
        if (!this.isIntersect(other)) {
            return [this, other];
        }
        if (other.contains(this)) {
            return [other];
        }
        else if (this.contains(other)) {
            return [this];
        }
        var newStart = this.start;
        var newEnd = this.end;
        if (this.contains(other.start)) {
            newEnd = other.end;
        }
        if (other.contains(this.start)) {
            newStart = other.start;
        }
        return [new AngleRange(newStart, newEnd, this.startInclusive || other.startInclusive, this.endInclusive || other.endInclusive)];
    };
    AngleRange.prototype.sub = function (other) {
        if (!this.isIntersect(other)) {
            return [this];
        }
        if (other.contains(this)) {
            return [];
        }
        if (this.contains(other.start) && this.contains(other.end)) {
            var r1_1 = new AngleRange(this.start, other.start, this.startInclusive, !other.startInclusive);
            var r2_1 = new AngleRange(other.end, this.end, !other.endInclusive, this.endInclusive);
            return [r1_1, r2_1];
        }
        if (other.contains(this.start)) {
            return [new AngleRange(other.end, this.end, !other.endInclusive, this.endInclusive)];
        }
        if (other.contains(this.end)) {
            return [new AngleRange(this.start, other.start, this.startInclusive, !other.startInclusive)];
        }
        return [this];
    };
    return AngleRange;
}());
var PI_VAL = Math.PI;
console.log("--- 1. Angle demonstration ---");
var a1 = Angle.fromDegrees(90);
var a2 = Angle.fromRadians(PI_VAL);
var a3 = Angle.fromDegrees(450); // 450 = 360 + 90
console.log("Angle 1: ".concat(a1.toString(), " (").concat(a1.degrees, "\u00B0)"));
console.log("Angle 2: ".concat(a2.toString(), " (").concat(a2.degrees, "\u00B0)"));
console.log("Angle 3: ".concat(a3.toString(), " (").concat(a3.degrees, "\u00B0)"));
console.log("Comparison a1 == a3 (considering period): ".concat(a1.isEquals(a3))); // true
console.log("Transformation a1: Float=".concat(a1.getFloat(), ", Int=").concat(a1.getInt()));
var sum = a1.add(a2);
console.log("Addition (90\u00B0 + 180\u00B0): ".concat(sum.degrees, "\u00B0"));
var mathOp = a1.add(0.5).sub(0.2).mul(2).div(1);
console.log("Chain of operations (numbers as radians): ".concat(mathOp.toString()));
console.log("\n--- 2. AngleRange demonstration ---");
var start = Angle.fromDegrees(350);
var end = Angle.fromDegrees(20);
var range = AngleRange.fromAngle(start, end, true, false);
console.log("Interval: ".concat(range.toString()));
console.log("Interval length: ".concat(range.abs));
var innerAngle = Angle.fromDegrees(5);
var outerAngle = Angle.fromDegrees(180);
console.log("Does 5\u00B0 fall within [350\u00B0, 20\u00B0): ".concat(range.contains(innerAngle))); // true
console.log("Does 180\u00B0 fall within [350\u00B0, 20\u00B0): ".concat(range.contains(outerAngle))); // false
console.log("\n--- 3. Operations with interval lists ---");
var r1 = AngleRange.fromNumber(0.1, 0.5, true, true);
var r2 = AngleRange.fromNumber(0.4, 0.8, true, true);
console.log("r1: ".concat(r1.toString()));
console.log("r2: ".concat(r2.toString()));
var addedRanges = r1.add(r2);
console.log("Result of addition r1 + r2: ".concat(addedRanges.map(function (r) { return r.toString(); }).join(' , ')));
var subbedRanges = r1.sub(r2);
console.log("Result of subtraction r1 - r2: ".concat(subbedRanges.map(function (r) { return r.toString(); }).join(' , ')));
console.log("\n--- 4. Comparison of intervals ---");
var r3 = AngleRange.fromNumber(0, 1);
var r4 = AngleRange.fromNumber(2 * PI_VAL, 1 + 2 * PI_VAL);
console.log("r3: ".concat(r3.toString()));
console.log("r4: ".concat(r4.toString()));
console.log("r3 is equivalent to r4: ".concat(r3.isEquals(r4)));
