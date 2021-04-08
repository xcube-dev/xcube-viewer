/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
    assertArrayNotEmpty,
    assertDefined,
    assertDefinedAndNotNull,
    assertArray,
    assertNotNull,
    assertTrue,
} from "./assert";


describe('assert', () => {

    it('assertTrue', () => {
        expect(() => assertTrue(false, "Argh!")).toThrowError("assertion failed: Argh!");
        expect(() => assertTrue(true, "Argh!")).not.toThrowError();
    });

    it('assertNotNull', () => {
        let geom: any = null;
        expect(() => assertNotNull(geom, "geom")).toThrowError("assertion failed: geom must not be null");
        geom = {};
        expect(() => assertNotNull(geom, "geom")).not.toThrowError();
    });

    it('assertDefined', () => {
        let geom: any;
        expect(() => assertDefined(geom, "geom")).toThrowError("assertion failed: geom must not be undefined");
        geom = {};
        expect(() => assertDefined(geom, "geom")).not.toThrowError();
    });

    it('assertDefinedAndNotNull', () => {
        let geom: any;
        expect(() => assertDefinedAndNotNull(geom, "geom")).toThrowError("assertion failed: geom must not be undefined");
        geom = null;
        expect(() => assertDefinedAndNotNull(geom, "geom")).toThrowError("assertion failed: geom must not be null");
        geom = {};
        expect(() => assertDefinedAndNotNull(geom, "geom")).not.toThrowError();
    });

    it('assertArray', () => {
        let coords: any;
        expect(() => assertArray(coords, "coords")).toThrowError("assertion failed: coords must be an array");
        coords = null;
        expect(() => assertArray(coords, "coords")).toThrowError("assertion failed: coords must be an array");
        coords = {};
        expect(() => assertArray(coords, "coords")).toThrowError("assertion failed: coords must be an array");
        coords = [];
        expect(() => assertArray(coords, "coords")).not.toThrowError();
    });

    it('assertArrayNotEmpty', () => {
        let coords: any;
        expect(() => assertArrayNotEmpty(coords, "coords")).toThrowError("assertion failed: coords must be an array");
        coords = null;
        expect(() => assertArrayNotEmpty(coords, "coords")).toThrowError("assertion failed: coords must be an array");
        coords = {};
        expect(() => assertArrayNotEmpty(coords, "coords")).toThrowError("assertion failed: coords must be an array");
        coords = [];
        expect(() => assertArrayNotEmpty(coords, "coords")).toThrowError("assertion failed: coords must be a non-empty array");
        coords = [5.3];
        expect(() => assertArrayNotEmpty(coords, "coords")).not.toThrowError();
    });
});

