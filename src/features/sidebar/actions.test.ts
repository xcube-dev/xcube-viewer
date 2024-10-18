import { describe, it, expect, beforeEach } from "vitest";

import { AppStoreZ, StoreState } from "@/features/sidebar/store";
import { setSidebarPanelId } from "@/features/sidebar/actions";

describe("Test Sidebar Panel ID state management", () => {
  afterEach(() => {
    AppStoreZ.setState({ sidebarPanelId: "info" });
  });

  it("should return the initial state", () => {
    expect(AppStoreZ.getState().sidebarPanelId).toBe("info");
  });

  it("should not accept invalid panel IDs", () => {
    setSidebarPanelId("holoStats" as unknown as SidebarPanelId);
    expect(AppStoreZ.getState()).toEqual({
      sidebarPanelId: "info",
    });
  });

  it("should update the state to other panel IDs", () => {
    const panelIds: SidebarPanelId[] = ["info", "stats", "timeSeries", "volume"];
    panelIds.forEach((panelId) => {
      setSidebarPanelId(panelId);
      expect(AppStoreZ.getState()).toEqual({
        sidebarPanelId: panelId,
      });
    }
  });
});
