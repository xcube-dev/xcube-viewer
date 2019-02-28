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

