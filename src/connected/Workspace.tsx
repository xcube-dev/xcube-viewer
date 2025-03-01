/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

// noinspection JSUnusedLocalSymbols

import { CSSProperties, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";

import { AppState } from "@/states/appState";
import { setSidebarPosition } from "@/actions/controlActions";
import SplitPane from "@/components/SplitPane";
import Viewer from "./Viewer";
import Sidebar from "./Sidebar";
import { useTheme } from "@mui/material";

// Adjust for debugging split pane style
const styles: Record<string, CSSProperties> = {
  containerHor: {
    flexGrow: 1,
    overflow: "hidden",
  },
  containerVer: {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
  },

  viewerHor: {
    height: "100%",
    overflow: "hidden",
    padding: 0,
  },
  viewerVer: {
    width: "100%",
    overflow: "hidden",
    padding: 0,
  },

  sidebarHor: {
    flex: "auto",
    overflowX: "hidden",
    overflowY: "auto",
  },
  sidebarVer: {
    width: "100%",
    overflow: "hidden",
  },

  viewer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
};

interface WorkspaceImplProps {
  sidebarOpen: boolean;
  sidebarPosition: number;
  setSidebarPosition: (sidebarPos: number) => void;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    sidebarOpen: state.controlState.sidebarOpen,
    sidebarPosition: state.controlState.sidebarPosition,
  };
};

const mapDispatchToProps = {
  setSidebarPosition,
};

type Layout = "hor" | "ver";
const getLayout = (): Layout => {
  return window.innerWidth / window.innerHeight >= 1 ? "hor" : "ver";
};

function WorkspaceImpl({
  sidebarOpen,
  sidebarPosition,
  setSidebarPosition,
}: WorkspaceImplProps) {
  const [map, setMap] = useState<OlMap | null>(null);
  const [layout, setLayout] = useState<Layout>(getLayout());
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const theme = useTheme();

  useEffect(() => {
    updateLayout();
    resizeObserver.current = new ResizeObserver(updateLayout);
    resizeObserver.current.observe(document.documentElement);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.updateSize();
    }
  }, [map, sidebarPosition]);

  const updateLayout = () => {
    setLayout(getLayout());
  };

  const dirSuffix = layout === "hor" ? "Hor" : "Ver";

  if (sidebarOpen) {
    return (
      <SplitPane
        dir={layout}
        splitPosition={sidebarPosition}
        setSplitPosition={setSidebarPosition}
        style={styles["container" + dirSuffix]}
        child1Style={styles["viewer" + dirSuffix]}
        child2Style={styles["sidebar" + dirSuffix]}
      >
        <Viewer onMapRef={setMap} theme={theme} />
        <Sidebar />
      </SplitPane>
    );
  } else {
    return (
      <div style={styles.viewer}>
        <Viewer onMapRef={setMap} theme={theme} />
      </div>
    );
  }
}

const Workspace = connect(mapStateToProps, mapDispatchToProps)(WorkspaceImpl);
export default Workspace;
