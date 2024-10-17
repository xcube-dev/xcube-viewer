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

import { CSSProperties, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";

import { AppState } from "@/states/appState";
import { setSidebarPosition } from "@/actions/controlActions";
import SplitPane from "@/components/SplitPane";
import Viewer from "./Viewer";
import Sidebar from "@/features/sidebar/components/Sidebar";
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

interface WorkspaceProps {
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

function _Workspace({
  sidebarOpen,
  sidebarPosition,
  setSidebarPosition,
}: WorkspaceProps) {
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

const Workspace = connect(mapStateToProps, mapDispatchToProps)(_Workspace);
export default Workspace;
