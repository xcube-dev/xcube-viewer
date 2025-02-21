/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { default as OlMap } from "ol/Map";
import { Control as OlControl } from "ol/control";

import { MapComponent, MapComponentProps } from "../MapComponent";

interface ControlProps extends MapComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export class Control extends MapComponent<OlControl, ControlProps> {
  divRef: HTMLDivElement | null = null;

  handleDivRef = (divRef: HTMLDivElement | null) => {
    this.divRef = divRef;
  };

  addMapObject(map: OlMap): OlControl {
    // console.log(`Control: added control '${this.props.id}'`);
    const control = new OlControl({ element: this.divRef! });
    map.addControl(control);
    return control;
  }

  updateMapObject(
    _map: OlMap,
    control: OlControl,
    _prevProps: Readonly<ControlProps>,
  ): OlControl {
    return control;
  }

  removeMapObject(map: OlMap, control: OlControl): void {
    for (const addedControl of map.getControls().getArray()) {
      if (addedControl === control) {
        // console.log(`Control: removing control '${this.props.id}'`);
        map.removeControl(control);
        break;
      }
    }
  }

  render() {
    const { children, style, className } = this.props;
    const _className =
      (className ? className + " " : "") + "ol-unselectable ol-control";
    return (
      <div style={style} className={_className} ref={this.handleDivRef}>
        {children}
      </div>
    );
  }
}
