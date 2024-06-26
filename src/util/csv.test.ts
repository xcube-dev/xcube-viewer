/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

import { expect, it, describe } from "vitest";
import { parseCsv } from "./csv";

describe("Assert that csv.parseCsv()", () => {
  it("returns empty array for empty text", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("returns empty array for only spaces", () => {
    expect(parseCsv("   ")).toEqual([]);
  });

  it("returns empty array for only newlines", () => {
    expect(parseCsv("\n")).toEqual([]);
    expect(parseCsv("\n\n")).toEqual([]);
  });

  it("returns empty array for only newlines, and spaces", () => {
    expect(parseCsv("  \n  \n    ")).toEqual([]);
  });

  it("returns empty array for comment", () => {
    expect(parseCsv("# what?")).toEqual([]);
  });

  it("returns empty array for only comment, newlines, and spaces", () => {
    expect(parseCsv("  \n #what?  \n    # bye!")).toEqual([]);
  });
});

describe("Assert that csv.parseCsv() for a single cell", () => {
  it("returns single cell", () => {
    expect(parseCsv("id")).toEqual([["id"]]);
  });

  it("returns single cell with inner whitespace retained", () => {
    expect(parseCsv("the id")).toEqual([["the id"]]);
  });

  it("returns single cell with outer whitespace removed", () => {
    expect(parseCsv(" id  ")).toEqual([["id"]]);
  });
});

describe("Assert that csv.parseCsv() for quotes", () => {
  it("returns empty string for 2 quotes", () => {
    expect(parseCsv('""')).toEqual([[""]]);
  });

  it("returns value with quotes", () => {
    expect(parseCsv('"id"')).toEqual([["id"]]);
  });

  it("returns value with quotes including separator", () => {
    expect(parseCsv('"lat,lon"')).toEqual([["lat,lon"]]);
  });

  it("raises if quotes are not provided as pair", () => {
    expect(() => parseCsv('"lat", "lon')).toThrowError(
      'line 1, column 7: missing quote character ["]',
    );
  });
});

describe("Assert that csv.parseCsv() for escape", () => {
  it("returns value with separators", () => {
    expect(parseCsv("id\\,lat\\,lon")).toEqual([["id,lat,lon"]]);
  });

  it("returns value with escape character", () => {
    expect(parseCsv("this\\\\is\\\\a\\\\windows\\\\path")).toEqual([
      ["this\\is\\a\\windows\\path"],
    ]);
  });

  it("returns value with quotes", () => {
    expect(parseCsv('"She said \\"yes\\", and disappeared."')).toEqual([
      ['She said "yes", and disappeared.'],
    ]);
  });
});

describe("Assert that csv.parseCsv() for multiple cells", () => {
  it("returns multiple values", () => {
    expect(parseCsv("id,lon,lat,time,data")).toEqual([
      ["id", "lon", "lat", "time", "data"],
    ]);
  });

  it("returns multiple values with whitespaces removed", () => {
    expect(parseCsv("id, lon , lat , time , data")).toEqual([
      ["id", "lon", "lat", "time", "data"],
    ]);
  });
});

describe("Assert that csv.parseCsv() with empty cells", () => {
  it("returns 2 null values for 2 empty cells", () => {
    expect(parseCsv(",")).toEqual([[null, null]]);
  });

  it("returns null values for empty cells", () => {
    expect(parseCsv(",,,")).toEqual([[null, null, null, null]]);
  });

  it("returns null values for empty cells with spaces", () => {
    expect(parseCsv(", ,   , ")).toEqual([[null, null, null, null]]);
  });
});

describe("Assert that csv.parseCsv() with numbers", () => {
  it("converts a number", () => {
    expect(parseCsv("53.1")).toEqual([[53.1]]);
  });

  it("converts two numbers", () => {
    expect(parseCsv("53.1,11.8")).toEqual([[53.1, 11.8]]);
  });

  it("converts two numbers with whitespace", () => {
    expect(parseCsv("53.1, 11.8")).toEqual([[53.1, 11.8]]);
  });

  it("converts NaN", () => {
    expect(parseCsv("NaN")).toEqual([[Number.NaN]]);
  });
});

describe("Assert that csv.parseCsv() with booleans", () => {
  it("converts to true", () => {
    expect(parseCsv("true")).toEqual([[true]]);
  });

  it("converts to false", () => {
    expect(parseCsv("true")).toEqual([[true]]);
  });

  it("converts multiple values", () => {
    expect(parseCsv("true, false, true, true, false")).toEqual([
      [true, false, true, true, false],
    ]);
  });

  it("converts multiple values including empty values", () => {
    expect(parseCsv("true, , true, true, false")).toEqual([
      [true, null, true, true, false],
    ]);
  });
});

describe("Assert that csv.parseCsv() for multiple rows", () => {
  it("does a good job", () => {
    const text =
      "# Header\n" +
      "id, lon, lat, flag, value, station\n" +
      "# Data\n" +
      "0, 10.1, 52.5, true, 0.03, A3\n" +
      "1, 10.2, 52.6, true, 0.08, A6\n" +
      "2, 10.3, 52.7, false, 0.04, \n" +
      "3, 10.4, 52.8, false, NaN, A1\n";
    expect(parseCsv(text)).toEqual([
      ["id", "lon", "lat", "flag", "value", "station"],
      [0, 10.1, 52.5, true, 0.03, "A3"],
      [1, 10.2, 52.6, true, 0.08, "A6"],
      [2, 10.3, 52.7, false, 0.04, null],
      [3, 10.4, 52.8, false, NaN, "A1"],
    ]);
  });
});
