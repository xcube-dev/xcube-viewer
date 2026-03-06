/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";

import { AppState } from "@/states/appState";
import { updateSidePanelSize } from "@/actions/controlActions";
import SplitPane from "@/components/SplitPane";
import { SIDEBAR_WIDTH } from "@/components/SidePanel/styles";
import Viewer from "./Viewer";
import SidePanel from "./SidePanel";
import { makeCssStyles } from "@/util/styles";
import useResizeObserver from "@/hooks/useResizeObserver";

// Adjust for debugging split pane style
const styles = makeCssStyles({
  containerHor: {
    flexGrow: 1,
    overflow: "hidden",
    height: "100%",
  },
  containerVer: {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
    height: "100%",
  },

  viewer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    /*    minWidth: 0,
    minHeight: 0,*/
  },

  sidePanelSplit: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },

  sidePanelNoPanelHor: {
    flexGrow: 0,
    height: "100%",
  },

  sidePanelNoPanelVer: {
    flexGrow: 0,
  },

  sidePanelHidden: {
    display: "none",
  },
});

interface WorkspaceImplProps {
  sidePanelOpen: boolean;
  sidePanelId: string | null;
  sidePanelSize: number;
  updateSidePanelSize: (sizeDelta: number) => void;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    sidePanelOpen: state.controlState.sidePanelOpen,
    sidePanelId: state.controlState.sidePanelId,
    sidePanelSize: state.controlState.sidePanelSize,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  updateSidePanelSize,
};

type Layout = "hor" | "ver";
const getLayout = (): Layout => {
  return window.innerWidth / window.innerHeight >= 1 ? "hor" : "ver";
};

function WorkspaceImpl({
  sidePanelOpen,
  sidePanelId,
  sidePanelSize,
  updateSidePanelSize,
}: WorkspaceImplProps) {
  const [map, setMap] = useState<OlMap | null>(null);
  const [layout, setLayout] = useState<Layout>(getLayout());
  const theme = useTheme();

  useEffect(() => {
    updateLayout();
  }, []);

  useResizeObserver(() => {
    updateLayout();
  });

  useEffect(() => {
    if (map) {
      map.updateSize();
    }
  }, [map, sidePanelSize, sidePanelOpen, sidePanelId, layout]);

  const updateLayout = () => {
    setLayout(getLayout());
  };

  const showSidebar = sidePanelOpen;
  const showPanelContent = sidePanelOpen && !!sidePanelId;

  const effectiveChildSize = !showSidebar
    ? 0
    : showPanelContent
      ? sidePanelSize
      : SIDEBAR_WIDTH;

  return (
    <SplitPane
      dir={layout}
      childPos={"last"}
      childSize={effectiveChildSize}
      updateChildSize={showPanelContent ? updateSidePanelSize : () => {}}
      showResizeHandle={showPanelContent}
      style={layout === "hor" ? styles.containerHor : styles.containerVer}
    >
      <div style={styles.viewer}>
        <Viewer onMapRef={setMap} theme={theme} />
      </div>

      <Box
        sx={
          showSidebar
            ? showPanelContent
              ? styles.sidePanelSplit
              : layout === "hor"
                ? styles.sidePanelNoPanelHor
                : styles.sidePanelNoPanelVer
            : styles.sidePanelHidden
        }
      >
        <SidePanel />
      </Box>
    </SplitPane>
  );
}

const Workspace = connect(mapStateToProps, mapDispatchToProps)(WorkspaceImpl);
export default Workspace;
