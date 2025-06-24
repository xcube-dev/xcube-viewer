/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { maps } from "./maps";

describe("maps", () => {
  it("can load maps", () => {
    expect(maps).toBeInstanceOf(Array);
    expect(maps.length).toBeGreaterThan(0);
  });
});
