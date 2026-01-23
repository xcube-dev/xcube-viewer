/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

type Value = number;
type ValueRange = [number, number];
type Values = number[];
type Fn = (x: Value) => Value;

const ident = (x: Value) => x;
const pow10 = (x: Value) => Math.pow(10, x);
const log10 = Math.log10;

const applyFn = (x: Value | ValueRange | Values, fn: Fn) =>
  typeof x === "number" ? fn(x) : x.map(fn);

// noinspection JSUnusedGlobalSymbols
/**
 * A class representing a scaling operation.
 * @class
 */
export default class Scaling {
  private readonly _fn: Fn;
  private readonly _invFn: Fn;

  constructor(isLog: boolean) {
    if (isLog) {
      this._fn = log10;
      this._invFn = pow10;
    } else {
      this._fn = ident;
      this._invFn = ident;
    }
  }

  scale(x: Value): Value;
  scale(x: ValueRange): ValueRange;
  scale(x: Values): Values;
  scale(x: Value | ValueRange | Values) {
    return applyFn(x, this._fn);
  }

  scaleInv(x: Value): Value;
  scaleInv(x: ValueRange): ValueRange;
  scaleInv(x: Values): Values;
  scaleInv(x: Value | ValueRange | Values) {
    return applyFn(x, this._invFn);
  }
}
