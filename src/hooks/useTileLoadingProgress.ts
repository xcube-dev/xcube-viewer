/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect } from "react";
import type TileSource from "ol/source/Tile";
import { default as OlTileLayer } from "ol/layer/Tile";
import { default as OlMap } from "ol/Map";

// this solution is based on this example:
// https://openlayers.org/en/latest/examples/tile-load-events.html
export function useTileLoadingProgress(
  map: OlMap | null,
  setProgress: (progress: number) => void,
  setVisibility: (visibility: "hidden" | "visible") => void,
) {
  useEffect(() => {
    if (!map) return;

    let loading = 0;
    let loaded = 0;

    const updateProgress = () => {
      let percent = loading > 0 ? (loaded / loading) * 100 : 0;
      setProgress(Math.min(percent, 100));
      console.log(percent);
    };

    const onTileLoadStart = () => {
      loading++;
      updateProgress();
    };

    const onTileLoadEnd = () => {
      loaded++;
      updateProgress();
    };

    const onTileLoadError = () => {
      loaded++;
      updateProgress();
    };

    const onMapLoadStart = () => {
      setVisibility("visible");
    };

    const onMapLoadEnd = () => {
      setTimeout(() => {
        setVisibility("hidden");
        setProgress(0);
        loading = 0;
        loaded = 0;
      }, 300);
    };

    const layers = map.getLayers().getArray();
    const sourcesWithListeners: TileSource[] = [];

    for (const layer of layers) {
      if (layer instanceof OlTileLayer) {
        const source = layer.getSource();
        if (source) {
          sourcesWithListeners.push(source);
          source.on("tileloadstart", onTileLoadStart);
          source.on("tileloadend", onTileLoadEnd);
          source.on("tileloaderror", onTileLoadError);
        }
      }
    }

    map.on("loadstart", onMapLoadStart);
    map.on("loadend", onMapLoadEnd);

    return () => {
      for (const source of sourcesWithListeners) {
        source.un("tileloadstart", onTileLoadStart);
        source.un("tileloadend", onTileLoadEnd);
        source.un("tileloaderror", onTileLoadError);
        map.un("loadstart", onMapLoadStart);
        map.un("loadend", onMapLoadEnd);
      }
    };
  }, [map, setProgress, setVisibility]);
}
