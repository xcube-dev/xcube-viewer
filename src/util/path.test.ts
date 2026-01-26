/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { buildPath } from "./path";

describe("buildPath", () => {
  it("works", () => {
    expect(buildPath("")).toEqual("");
    expect(buildPath("p1")).toEqual("p1");
    expect(buildPath("p1", "p2", "")).toEqual("p1/p2");
    expect(buildPath("p1", "", "p2")).toEqual("p1/p2");
    expect(buildPath("p1", "", "", "p2")).toEqual("p1/p2");
    expect(buildPath("", "p1", "p2")).toEqual("/p1/p2");
  });
  it("works with separators", () => {
    expect(buildPath("p1/")).toEqual("p1/");
    expect(buildPath("p1/", "p2")).toEqual("p1/p2");
    expect(buildPath("p1/", "/p2")).toEqual("p1/p2");
    expect(buildPath("p1", "/p2")).toEqual("p1/p2");
    expect(buildPath("/p1/")).toEqual("/p1/");
    expect(buildPath("/p1/", "p2")).toEqual("/p1/p2");
    expect(buildPath("/p1/", "/p2")).toEqual("/p1/p2");
    expect(buildPath("/p1", "/p2")).toEqual("/p1/p2");
    expect(buildPath("p1/", "p2/")).toEqual("p1/p2/");
    expect(buildPath("p1/", "/p2/")).toEqual("p1/p2/");
    expect(buildPath("p1", "/p2/")).toEqual("p1/p2/");
  });
});
