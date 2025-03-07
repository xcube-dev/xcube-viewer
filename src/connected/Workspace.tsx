/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";

import { AppState } from "@/states/appState";
import { setSidebarPosition } from "@/actions/controlActions";
import SplitPane from "@/components/SplitPane";
import Viewer from "./Viewer";
import SidePanel from "./SidePanel";
import { makeCssStyles } from "@/util/styles";

// Adjust for debugging split pane style
const styles = makeCssStyles({
  containerHor: {
    flexGrow: 1,
    overflow: "hidden",
  },
  containerVer: {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
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

  viewer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },

  sidebarAlone: {
    flexGrow: 0,
  },
});

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

  if (sidebarOpen) {
    if (sidebarPanelId) {
      // Viewer & Panel & Sidebar
      return (
        <SplitPane
          dir={layout}
          splitPosition={sidebarPosition}
          setSplitPosition={setSidebarPosition}
          style={layout === "hor" ? styles.containerHor : styles.containerVer}
        >
          <Viewer onMapRef={setMap} theme={theme} />
          <SidePanel />
        </SplitPane>
      );
    } else {
      // Viewer & Sidebar - no Panel
      return (
        <Box sx={layout === "hor" ? styles.noSplitHor : styles.noSplitVer}>
          <Viewer onMapRef={setMap} theme={theme} />
          <div style={styles.sidebarAlone}>
            <SidePanel />
          </div>
        </Box>
      );
    }
  } else {
    // Viewer alone - no Panel, no Sidebar
    return (
      <div style={styles.viewer}>
        <Viewer onMapRef={setMap} theme={theme} />
      </div>
    );
  }
}

const Workspace = connect(mapStateToProps, mapDispatchToProps)(WorkspaceImpl);
export default Workspace;
