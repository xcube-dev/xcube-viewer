/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { comparePanelModels } from "./panelModel";

describe("comparePanelModels", () => {
  it("sorts empty arrays", () => {
    expect([].sort(comparePanelModels)).toEqual([]);
  });

  it("sorts by title", () => {
    expect(
      [
        { id: "d", title: "Panel D" },
        { id: "a", title: "Panel A" },
        { id: "e", title: "Panel E" },
        { id: "c", title: "Panel C" },
        { id: "b", title: "Panel B" },
      ].sort(comparePanelModels),
    ).toEqual([
      { id: "a", title: "Panel A" },
      { id: "b", title: "Panel B" },
      { id: "c", title: "Panel C" },
      { id: "d", title: "Panel D" },
      { id: "e", title: "Panel E" },
    ]);
  });

  it("sorts by position", () => {
    expect(
      [
        { id: "d", title: "Panel D", position: 2 },
        { id: "a", title: "Panel A", position: 4 },
        { id: "e", title: "Panel E", position: 0 },
        { id: "c", title: "Panel C", position: 3 },
        { id: "b", title: "Panel B", position: 1 },
      ].sort(comparePanelModels),
    ).toEqual([
      { id: "e", title: "Panel E", position: 0 },
      { id: "b", title: "Panel B", position: 1 },
      { id: "d", title: "Panel D", position: 2 },
      { id: "c", title: "Panel C", position: 3 },
      { id: "a", title: "Panel A", position: 4 },
    ]);
  });

  it("sorts by by title for same positions", () => {
    expect(
      [
        { id: "d", title: "Panel D", position: 0 },
        { id: "a", title: "Panel A", position: 1 },
        { id: "e", title: "Panel E", position: 0 },
        { id: "c", title: "Panel C", position: 0 },
        { id: "b", title: "Panel B", position: 1 },
      ].sort(comparePanelModels),
    ).toEqual([
      { id: "c", title: "Panel C", position: 0 },
      { id: "d", title: "Panel D", position: 0 },
      { id: "e", title: "Panel E", position: 0 },
      { id: "a", title: "Panel A", position: 1 },
      { id: "b", title: "Panel B", position: 1 },
    ]);
  });

  it("sorts positions first", () => {
    expect(
      [
        { id: "d", title: "Panel D", position: 1 },
        { id: "a", title: "Panel A" },
        { id: "e", title: "Panel E", position: 0 },
        { id: "b", title: "Panel B" },
        { id: "c", title: "Panel C", position: 2 },
      ].sort(comparePanelModels),
    ).toEqual([
      { id: "e", title: "Panel E", position: 0 },
      { id: "d", title: "Panel D", position: 1 },
      { id: "c", title: "Panel C", position: 2 },
      { id: "a", title: "Panel A" },
      { id: "b", title: "Panel B" },
    ]);
  });
});
