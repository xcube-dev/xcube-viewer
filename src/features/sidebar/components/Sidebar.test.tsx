import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";

import { AppStoreZ } from "@/features/sidebar/store";
import Sidebar from "@/features/sidebar/components/Sidebar";
import * as actions from "@/features/sidebar/actions";

vi.mock("@/connected/InfoPanel", () => {
  return {
    default: () => <div>Info Panel</div>,
  };
});
vi.mock("@/connected/TimeSeriesPanel", () => {
  return {
    default: () => <div>Time-Series Panel</div>,
  };
});
vi.mock("@/connected/StatisticsPanel", () => {
  return {
    default: () => <div>Statistics Panel</div>,
  };
});
vi.mock("@/connected/VolumePanel", () => {
  return {
    default: () => <div>Volume Panel</div>,
  };
});

const setSidebarPanelIdSpy = vi.spyOn(actions, "setSidebarPanelId");

describe("Sidebar Component", () => {
  beforeEach(() => {
    setSidebarPanelIdSpy.mockClear();
    AppStoreZ.setState({ sidebarPanelId: "info" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("displays the correct initial panel", () => {
    render(<Sidebar />);
    expect(screen.getByText("Info Panel")).toBeInTheDocument();
  });

  it("changes the panel when a tab is clicked", () => {
    render(<Sidebar />);

    fireEvent.click(screen.getByText("Statistics"));

    expect(screen.getByText("Statistics Panel")).toBeInTheDocument();
  });

  it("displays all tabs", () => {
    render(<Sidebar />);

    const tabNames = ["Info", "Statistics", "Time-Series", "Volume"];
    tabNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("calls setSidebarPanelId with the correct value stats", () => {
    render(<Sidebar />);
    screen.debug();

    fireEvent.click(screen.getByText("Statistics"));

    expect(setSidebarPanelIdSpy).toHaveBeenCalledWith("stats");
    expect(setSidebarPanelIdSpy).toHaveBeenCalledTimes(1);
  });

  it("calls setSidebarPanelId with the correct number of times", () => {
    render(<Sidebar />);
    screen.debug();
    fireEvent.click(screen.getByText("Statistics"));
    fireEvent.click(screen.getByText("Statistics"));

    expect(setSidebarPanelIdSpy).toHaveBeenCalledWith("stats");
    expect(setSidebarPanelIdSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Volume"));
    fireEvent.click(screen.getByText("Statistics"));

    expect(setSidebarPanelIdSpy).toHaveBeenCalledWith("stats");
    expect(setSidebarPanelIdSpy).toHaveBeenCalledTimes(3);
  });

  it("calls setSidebarPanelId with the correct value volume", () => {
    render(<Sidebar />);
    screen.debug();
    fireEvent.click(screen.getByText("Volume"));

    expect(setSidebarPanelIdSpy).toHaveBeenCalledWith("volume");
    expect(setSidebarPanelIdSpy).toHaveBeenCalledTimes(1);
  });

  it("calls setSidebarPanelId with the no calls when it is info", () => {
    render(<Sidebar />);

    fireEvent.click(screen.getByText("Info"));
    fireEvent.click(screen.getByText("Info"));

    expect(setSidebarPanelIdSpy).toHaveBeenCalledTimes(0);
  });
});
