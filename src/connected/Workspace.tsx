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

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";
import { Theme } from "@mui/system";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

import { AppState } from "@/states/appState";
import SplitPane from "@/components/SplitPane";
import Viewer from "./Viewer";
import Sidebar from "./Sidebar";
import { setSidebarPosition } from "@/actions/controlActions";

// Adjust for debugging split pane style
const mapExtraStyle: CSSProperties = { padding: 0 };

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

interface WorkspaceProps extends WithStyles<typeof styles> {
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

const _Workspace: React.FC<WorkspaceProps> = ({
  classes,
  sidebarOpen,
  sidebarPosition,
  setSidebarPosition,
}) => {
  const [currentSplitPos, setCurrentSplitPos] = useState(sidebarPosition);
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

  function handleSplitChange(currentSplitPos: number) {
    if (map) {
      map.updateSize();
    }
    setCurrentSplitPos(currentSplitPos);
  }

  function handleSplitCommit(newSidebarPosition: number) {
    setSidebarPosition(newSidebarPosition);
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
        splitPosition={currentSplitPos}
        onChange={handleSplitChange}
        onCommit={handleSplitCommit}
        className={splitPaneClassName}
        child1ClassName={mapPaneClassName}
        child2ClassName={detailsPaneClassName}
      >
        <Viewer onMapRef={setMap} />
        <Sidebar />
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
