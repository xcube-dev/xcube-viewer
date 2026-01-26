/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { default as OlMap } from "ol/Map";
import { default as OlBaseObject } from "ol/Object";
import { default as OlMapBrowserEvent } from "ol/MapBrowserEvent";
import { default as OlView } from "ol/View";
import { default as OlEvent } from "ol/events/Event";
import { EventsKey as OlEventsKey } from "ol/events";
import { MapOptions as OlMapOptions } from "ol/PluggableMap";
import { TileSourceEvent as OlTileSourceEvent } from "ol/source/Tile";
import { unByKey as ol_unByKey } from "ol/Observable";

import { DEFAULT_MAP_CRS } from "@/model/proj";

import "ol/ol.css";
import "./Map.css";

export type MapElement = React.ReactElement | null | undefined;

export interface TileLoadProgress {
  value: number;
  active: boolean;
}

export interface MapContext {
  map?: OlMap;
  mapDiv?: HTMLDivElement | null;
  mapObjects: { [id: string]: OlBaseObject };
  // For tile layers
  reportTileLoadStart: (e: OlTileSourceEvent) => void;
  reportTileLoadEnd: (e: OlTileSourceEvent) => void;
  reportTileLoadError: (e: OlTileSourceEvent) => void;
}

export const MapContextType = React.createContext<MapContext>({
  mapObjects: {},
  // values are initially dummy handlers
  reportTileLoadStart: () => {},
  reportTileLoadEnd: () => {},
  reportTileLoadError: () => {},
});

interface MapProps extends OlMapOptions {
  id: string;
  children?: React.ReactNode;
  mapObjects?: { [id: string]: OlBaseObject };
  onClick?: (event: OlMapBrowserEvent<UIEvent>) => void;
  onZoom?: (event: OlMapBrowserEvent<UIEvent>, map: OlMap | undefined) => void;
  onMapRef?: (map: OlMap | null) => void;
  isStale?: boolean;
  onDropFiles?: (files: File[]) => void;
  onTileLoadProgress?: (progress: TileLoadProgress) => void;
}

interface MapState {
  numTilesLoading: number;
  numTilesLoaded: number;
  numTilesErrored: number;
}

const newMapState = () => ({
  // https://openlayers.org/en/latest/examples/tile-load-events.html
  numTilesLoading: 0,
  numTilesLoaded: 0,
  numTilesErrored: 0,
});

const DEFAULT_CONTAINER_STYLE: React.CSSProperties = {
  position: "relative",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};

export class Map extends React.Component<MapProps, MapState> {
  private readonly contextValue: MapContext;
  private clickEventsKey: OlEventsKey | null = null;
  private loadStartEventsKey: OlEventsKey | null = null;
  private loadEndEventsKey: OlEventsKey | null = null;
  private lastTileLoadProgress: TileLoadProgress | null = null;
  private zoomEventsKey: OlEventsKey | null = null;

  constructor(props: MapProps) {
    super(props);

    this.state = newMapState();

    const { id, mapObjects } = props;
    if (mapObjects) {
      this.contextValue = {
        map: (mapObjects[id] as OlMap) || undefined,
        mapObjects: mapObjects,
        reportTileLoadStart: this.reportTileLoadStart,
        reportTileLoadEnd: this.reportTileLoadEnd,
        reportTileLoadError: this.reportTileLoadError,
      };
    } else {
      this.contextValue = {
        mapObjects: {},
        reportTileLoadStart: this.reportTileLoadStart,
        reportTileLoadEnd: this.reportTileLoadEnd,
        reportTileLoadError: this.reportTileLoadError,
      };
    }
  }

  componentDidMount(): void {
    // console.log('Map.componentDidMount: id =', this.props.id);

    const { id } = this.props;
    const mapDiv = this.contextValue.mapDiv!;

    let map: OlMap | null = null;
    let view: OlView | null = null;
    if (this.props.isStale) {
      const mapObject = this.contextValue.mapObjects[id];
      if (mapObject instanceof OlMap) {
        map = mapObject;
        map.setTarget(mapDiv);
        if (this.clickEventsKey) {
          map.un("click", this.clickEventsKey.listener);
        }
        view = map?.getView();
        if (this.zoomEventsKey) {
          view.un("change:resolution", this.zoomEventsKey.listener);
        }
      }
    }

    if (!map) {
      const initialZoom = this.getMinZoom(mapDiv);
      const view = new OlView({
        projection: DEFAULT_MAP_CRS,
        center: [0, 0],
        minZoom: initialZoom,
        zoom: initialZoom,
      });
      map = new OlMap({
        view,
        ...this.getMapOptions(),
        target: mapDiv,
      });
    }

    view = map?.getView();

    this.contextValue.map = map;
    this.contextValue.mapObjects[id] = map;

    this.clickEventsKey = map.on("click", this.handleClick);
    this.loadStartEventsKey = map.on("loadstart", this.handleMapLoadStart);
    this.loadEndEventsKey = map.on("loadend", this.handleMapLoadEnd);
    this.zoomEventsKey = view.on("change:resolution", this.handleZoom);
    //map.set('objectId', this.props.id);
    map.updateSize();

    // Force update so we can pass this.map as context to all children in next render()
    this.forceUpdate();

    // Add resize listener, so we can adjust the view's minZoom.
    // See https://openlayers.org/en/latest/examples/min-zoom.html
    window.addEventListener("resize", this.handleResize);

    const onMapRef = this.props.onMapRef;
    if (onMapRef) {
      onMapRef(map);
    }
  }

  componentDidUpdate(_prevProps: Readonly<MapProps>): void {
    // console.log('Map.componentDidUpdate: id =', this.props.id);
    const map = this.contextValue.map!;
    const mapDiv = this.contextValue.mapDiv!;
    const mapOptions = this.getMapOptions();
    map.setProperties({ ...mapOptions });
    map.setTarget(mapDiv);
    map.updateSize();
  }

  componentWillUnmount(): void {
    // console.log('Map.componentWillUnmount: id =', this.props.id);
    // Remove map listeners
    ol_unByKey(this.clickEventsKey!);
    ol_unByKey(this.loadStartEventsKey!);
    ol_unByKey(this.loadEndEventsKey!);
    // Remove resize listeners
    window.removeEventListener("resize", this.handleResize);
    const onMapRef = this.props.onMapRef;
    if (onMapRef) {
      onMapRef(null);
    }
  }

  render() {
    let childrenWithContext;
    if (this.contextValue.map) {
      childrenWithContext = (
        <MapContextType.Provider value={this.contextValue}>
          {this.props.children}
        </MapContextType.Provider>
      );
    }
    return (
      <div
        ref={this.handleRef}
        style={DEFAULT_CONTAINER_STYLE}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        {childrenWithContext}
      </div>
    );
  }

  private getMapOptions(): OlMapOptions {
    const mapOptions = { ...this.props };
    delete mapOptions["children"];
    delete mapOptions["onClick"];
    delete mapOptions["onZoom"];
    delete mapOptions["onDropFiles"];
    delete mapOptions["onTileLoadProgress"];
    return mapOptions;
  }

  private handleClick = (event: OlEvent) => {
    const onClick = this.props.onClick;
    if (onClick) {
      onClick(event as OlMapBrowserEvent<UIEvent>);
    }
  };

  private handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (this.props.onDropFiles) {
      event.preventDefault();

      const files: File[] = [];
      if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file !== null) {
              files.push(file);
            }
          }
        }
      } else if (event.dataTransfer.files) {
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          const file = event.dataTransfer.files[i];
          if (file !== null) {
            files.push(file);
          }
        }
      }
      if (files.length) {
        this.props.onDropFiles(files);
      }
    }
  };

  private handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (this.props.onDropFiles) {
      event.preventDefault();
    }
  };

  private readonly handleRef = (mapDiv: HTMLDivElement | null) => {
    this.contextValue.mapDiv = mapDiv;
  };

  private handleResize = () => {
    const mapDiv = this.contextValue.mapDiv;
    const map = this.contextValue.map;
    if (mapDiv && map) {
      map.updateSize();
      const view = map.getView();
      const minZoom = this.getMinZoom(mapDiv);
      if (minZoom !== view.getMinZoom()) {
        view.setMinZoom(minZoom);
      }
    }
  };

  private getMinZoom = (target: HTMLDivElement) => {
    // Adjust the view's minZoom so there is only one world,
    // see https://openlayers.org/en/latest/examples/min-zoom.html
    const size = target.clientWidth;
    const minZoom = Math.LOG2E * Math.log(size / 256);
    if (minZoom >= 0.0) {
      return minZoom;
    }
    return 0;
  };

  private handleZoom = (event: OlEvent) => {
    const onZoom = this.props.onZoom;
    const map = this.contextValue.map;
    if (onZoom) {
      onZoom(event as OlMapBrowserEvent<UIEvent>, map);
    }
  };

  private handleMapLoadStart = () => {
    //this.resetProgressState();
  };

  private handleMapLoadEnd = () => {
    this.resetProgressState();
  };

  private resetProgressState = () => {
    this.setState(newMapState(), this.reportProgressUpdate);
  };

  private reportTileLoadStart = (e: OlTileSourceEvent) => {
    this.reportTileLoadInternal(e, (s: MapState) => ({
      numTilesLoading: s.numTilesLoading + 1,
    }));
  };

  private reportTileLoadEnd = (e: OlTileSourceEvent) => {
    this.reportTileLoadInternal(e, (s: MapState) => ({
      numTilesLoaded: s.numTilesLoaded + 1,
    }));
  };

  private reportTileLoadError = (e: OlTileSourceEvent) => {
    this.reportTileLoadInternal(e, (s: MapState) => ({
      numTilesErrored: s.numTilesErrored + 1,
    }));
  };

  private reportTileLoadInternal = <K extends keyof MapState>(
    _e: OlTileSourceEvent,
    updater: (s: Readonly<MapState>) => Pick<MapState, K>,
  ) => {
    const onTileLoadProgress = this.props.onTileLoadProgress;
    if (onTileLoadProgress) {
      // Only report if we have a handler
      this.setState(updater, this.reportProgressUpdate);
    }
  };

  private reportProgressUpdate = () => {
    const onTileLoadProgress = this.props.onTileLoadProgress;
    if (!onTileLoadProgress) {
      return;
    }
    const prevProgress = this.lastTileLoadProgress;
    // Note, we could also report tile load errors here
    const newProgress = {
      value: this.computeProgressValue(),
      active: this.isProgressActive(),
    };
    if (
      !prevProgress ||
      prevProgress.active !== newProgress.active ||
      prevProgress.value !== newProgress.value
    ) {
      onTileLoadProgress(newProgress);
      this.lastTileLoadProgress = newProgress;
    }
  };

  private isProgressActive = () => {
    return this.state.numTilesLoading > 0;
  };

  private computeProgressValue = () => {
    const loaded = this.state.numTilesLoaded;
    const errored = this.state.numTilesErrored;
    const loading = this.state.numTilesLoading;
    return (
      100 * Math.min(1, Math.max(0, loaded + errored) / Math.max(1, loading))
    );
  };
}
