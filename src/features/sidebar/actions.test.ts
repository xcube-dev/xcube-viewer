import { describe, it, expect, afterEach, vi } from "vitest";

import { store } from "@/store/store";
import { setSidebarPanelId } from "@/features/sidebar/actions";
import { SidebarPanelId } from "@/features/sidebar/types";

vi.mock("@/config", () => {
  return {
    Config: {
      instance: {
        name: "xyz",
      },
    },
  };
});

describe("Test Sidebar Panel ID state management", () => {
  afterEach(() => {
    store.setState({ sidebar: { sidebarPanelId: "info" } });
  });

  it("should return the initial state", () => {
    expect(store.getState()).toEqual({
      sidebar: {
        sidebarPanelId: "info",
      },
    });
  });

  it("should not accept invalid panel IDs", () => {
    setSidebarPanelId("holoStats" as unknown as SidebarPanelId);
    expect(store.getState()).toEqual({
      sidebar: {
        sidebarPanelId: "info",
      },
    });
  });

  it("should update the state to other panel IDs", () => {
    const panelIds: SidebarPanelId[] = [
      "info",
      "stats",
      "timeSeries",
      "volume",
    ];
    panelIds.forEach((panelId) => {
      setSidebarPanelId(panelId);
      expect(store.getState()).toEqual({
        sidebar: {
          sidebarPanelId: panelId,
        },
      });
    });
  });
});
