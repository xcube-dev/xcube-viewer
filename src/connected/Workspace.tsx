// noinspection JSUnusedLocalSymbols

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ReactElement, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";
import { Theme } from "@mui/system";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import InfoIcon from "@mui/icons-material/Info";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";

import { AppState } from "@/states/appState";
import SplitPane from "@/components/SplitPane";
import Viewer from "./Viewer";
import TimeSeriesPanel from "./TimeSeriesPanel";
import VolumePanel from "./VolumePanel";
import InfoPanel from "./InfoPanel";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { setSidebarPanelId } from "@/actions/controlActions";
import { SidebarPanelId, sidebarPanelIds } from "@/states/controlState";

const sidebarPanelIcons: Record<SidebarPanelId, ReactElement> = {
  info: <InfoIcon fontSize="inherit" />,
  charts: <StackedLineChartIcon fontSize="inherit" />,
  volume: <ThreeDRotationIcon fontSize="inherit" />,
};

const sidebarPanelLabels: Record<SidebarPanelId, string> = {
  info: "Info",
  charts: "Charts",
  volume: "Volume",
};

// Adjust for debugging split pane style
const mapExtraStyle: React.CSSProperties = { padding: 0 };

const styles = (_theme: Theme) =>
  createStyles({
    splitPaneHor: {
      flexGrow: 1,
      overflow: "hidden",
    },
    splitPaneVer: {
      flexGrow: 1,
      overflowX: "hidden",
      overflowY: "auto",
    },

    mapPaneHor: {
      height: "100%",
      overflow: "hidden",
      ...mapExtraStyle,
    },
    mapPaneVer: {
      width: "100%",
      overflow: "hidden",
      ...mapExtraStyle,
    },

    detailsPaneHor: {
      flex: "auto",
      overflowX: "hidden",
      overflowY: "auto",
    },
    detailsPaneVer: {
      width: "100%",
      overflow: "hidden",
    },

    viewerContainer: {
      overflow: "hidden",
      width: "100%",
      height: "100%",
    },
  });

const sxes = makeStyles({
  tabs: { minHeight: "34px" },
  tab: {
    padding: "5px 10px",
    textTransform: "none",
    fontWeight: "regular",
    minHeight: "32px",
  },
});

interface WorkspaceProps extends WithStyles<typeof styles> {
  sidebarOpen: boolean;
  sidebarPanelId: SidebarPanelId;
  setSidebarPanelId: (sidebarPanelId: SidebarPanelId) => void;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    sidebarOpen: state.controlState.sidebarOpen,
    sidebarPanelId: state.controlState.sidebarPanelId,
  };
};

const mapDispatchToProps = {
  setSidebarPanelId,
};

type Layout = "hor" | "ver";
const getLayout = (): Layout => {
  return window.innerWidth / window.innerHeight >= 1 ? "hor" : "ver";
};

const _Workspace: React.FC<WorkspaceProps> = ({
  classes,
  sidebarOpen,
  sidebarPanelId,
  setSidebarPanelId,
}) => {
  const [map, setMap] = useState<OlMap | null>(null);
  const [layout, setLayout] = useState<Layout>(getLayout());
  const resizeObserver = useRef<ResizeObserver | null>(null);

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

  const updateLayout = () => {
    setLayout(getLayout());
  };

  function handleResize(_size: number) {
    if (map) {
      map.updateSize();
    }
  }

  if (sidebarOpen) {
    const splitPaneClassName =
      layout === "hor" ? classes.splitPaneHor : classes.splitPaneVer;
    const mapPaneClassName =
      layout === "hor" ? classes.mapPaneHor : classes.mapPaneVer;
    const detailsPaneClassName =
      layout === "hor" ? classes.detailsPaneHor : classes.detailsPaneVer;
    return (
      <SplitPane
        dir={layout}
        initialSize={Math.max(window.innerWidth, window.innerHeight) / 2}
        onChange={handleResize}
        className={splitPaneClassName}
        child1ClassName={mapPaneClassName}
        child2ClassName={detailsPaneClassName}
      >
        <Viewer onMapRef={setMap} />
        {/* TODO: make own Sidebar component */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={sidebarPanelId}
              onChange={(_, value) => {
                setSidebarPanelId(value as SidebarPanelId);
              }}
              variant="scrollable"
              sx={sxes.tabs}
            >
              {sidebarPanelIds.map((panelId) => (
                <Tab
                  key={panelId}
                  icon={sidebarPanelIcons[panelId]}
                  iconPosition="start"
                  sx={sxes.tab}
                  disableRipple
                  value={panelId}
                  label={i18n.get(sidebarPanelLabels[panelId])}
                />
              ))}
            </Tabs>
          </Box>
          {sidebarPanelId === "info" && <InfoPanel />}
          {sidebarPanelId === "charts" && <TimeSeriesPanel />}
          {sidebarPanelId === "volume" && <VolumePanel />}
        </Box>
      </SplitPane>
    );
  } else {
    return (
      <div className={classes.viewerContainer}>
        <Viewer onMapRef={setMap} />
      </div>
    );
  }
};

const Workspace = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(_Workspace));
export default Workspace;
