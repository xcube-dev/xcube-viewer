/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";

import { AppState } from "@/states/appState";
import { setSidebarPosition } from "@/actions/controlActions";
import SplitPane from "@/components/SplitPane";
import Viewer from "./Viewer";
import SidePanel from "./SidePanel";

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

  sidebarHor: {
    flex: "auto",
    overflowX: "hidden",
    overflowY: "auto",
  },
  sidebarVer: {
    width: "100%",
    overflow: "hidden",
  },

  noSplitHor: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  noSplitVer: {
    display: "flex",
    flexDirection: "column",
  },

  viewerHor: {
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
    padding: 0,
  },
  viewerVer: {
    flexGrow: 1,
    width: "100%",
    overflow: "hidden",
    padding: 0,
  },

  viewer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
};

interface WorkspaceImplProps {
  sidebarOpen: boolean;
  sidebarPanelId: string | null;
  sidebarPosition: number;
  setSidebarPosition: (sidebarPos: number) => void;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    sidebarOpen: state.controlState.sidebarOpen,
    sidebarPanelId: state.controlState.sidebarPanelId,
    sidebarPosition: state.controlState.sidebarPosition,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  setSidebarPosition,
};

type Layout = "hor" | "ver";
const getLayout = (): Layout => {
  return window.innerWidth / window.innerHeight >= 1 ? "hor" : "ver";
};

function WorkspaceImpl({
  sidebarOpen,
  sidebarPanelId,
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
    if (sidebarPanelId) {
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
          <SidePanel />
        </SplitPane>
      );
    } else {
      return (
        <Box sx={layout === "hor" ? styles.noSplitHor : styles.noSplitVer}>
          <div style={layout === "hor" ? styles.viewerHor : styles.viewerVer}>
            <Viewer onMapRef={setMap} theme={theme} />
          </div>
          <SidePanel />
        </Box>
      );
    }
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
