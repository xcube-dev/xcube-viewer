/*
 * Copyright (c) 2019-2025 by xcube team and contributors
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

import { DEFAULT_MAP_CRS } from "@/model/proj";

import "ol/ol.css";
import "./Map.css";

export type MapElement = React.ReactElement | null | undefined;

export interface MapContext {
  map?: OlMap;
  mapDiv?: HTMLDivElement | null;
  mapObjects: { [id: string]: OlBaseObject };
}

export const MapContextType = React.createContext<MapContext>({
  mapObjects: {},
});

interface MapProps extends OlMapOptions {
  id: string;
  children?: React.ReactNode;
  mapObjects?: { [id: string]: OlBaseObject };
  onClick?: (event: OlMapBrowserEvent<UIEvent>) => void;
  onMapRef?: (map: OlMap | null) => void;
  isStale?: boolean;
  onDropFiles?: (files: File[]) => void;
}

type MapState = object;

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

  constructor(props: MapProps) {
    super(props);
    // console.log("Map.constructor: id =", this.props.id);

    const { id, mapObjects } = props;
    if (mapObjects) {
      this.contextValue = {
        map: (mapObjects[id] as OlMap) || undefined,
        mapObjects: mapObjects,
      };
    } else {
      this.contextValue = {
        mapObjects: {},
      };
    }
  }

  componentDidMount(): void {
    // console.log('Map.componentDidMount: id =', this.props.id);

    const { id } = this.props;
    const mapDiv = this.contextValue.mapDiv!;

    let map: OlMap | null = null;
    if (this.props.isStale) {
      const mapObject = this.contextValue.mapObjects[id];
      if (mapObject instanceof OlMap) {
        map = mapObject;
        map.setTarget(mapDiv);
        if (this.clickEventsKey) {
          map.un("click", this.clickEventsKey.listener);
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

    this.contextValue.map = map;
    this.contextValue.mapObjects[id] = map;

    this.clickEventsKey = map.on("click", this.handleClick);

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
    // if (this.clickEventsKey) {
    //     unByKey(this.clickEventsKey);
    // }
    // this.clickEventsKey = map.on('click', this.handleClick);
    // console.log('Map: ', this.handleClick, this.clickEventsKey);
    map.updateSize();
  }

  componentWillUnmount(): void {
    // console.log('Map.componentWillUnmount: id =', this.props.id);

    // Remove resize listeners
    window.removeEventListener("resize", this.handleResize);

    // if (this.clickEventsKey) {
    //     unByKey(this.clickEventsKey);
    // }

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
    delete mapOptions["onDropFiles"];
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
}
