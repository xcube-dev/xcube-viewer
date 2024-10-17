import { describe, it, expect, beforeEach } from "vitest";

import { AppStoreZ, StoreState } from "@/features/sidebar/store";
import { setSidebarPanelId } from "@/features/sidebar/actions";

describe("Test Sidebar Panel ID state management", () => {
  beforeEach(() => {
    AppStoreZ.setState({ sidebarPanelId: "info" });
  });

  it("should return the initial state", () => {
    expect(AppStoreZ.getState().sidebarPanelId).toBe("info");
  });

  it("should update the state to stats", () => {
    const expected: StoreState = {
      sidebarPanelId: "stats",
    };
    setSidebarPanelId("stats");
    expect(AppStoreZ.getState()).toStrictEqual(expected);
  });

  it("should update the state to timeSeries", () => {
    const expected: StoreState = {
      sidebarPanelId: "timeSeries",
    };
    setSidebarPanelId("timeSeries");
    expect(AppStoreZ.getState()).toStrictEqual(expected);
  });

  it("should update the state to timeSeries", () => {
    const expected: StoreState = {
      sidebarPanelId: "volume",
    };
    setSidebarPanelId("volume");
    expect(AppStoreZ.getState()).toStrictEqual(expected);
  });
});
