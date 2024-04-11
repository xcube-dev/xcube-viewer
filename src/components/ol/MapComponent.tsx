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

import * as React from "react";
import { default as OlBaseObject } from "ol/Object";
import { default as OlMap } from "ol/Map";

import { MapContext, MapContextType } from "./Map";

export interface MapComponentProps {
  id?: string;
}

export abstract class MapComponent<
  T extends OlBaseObject,
  P extends MapComponentProps,
  S = unknown,
> extends React.PureComponent<P, S> {
  // noinspection JSUnusedGlobalSymbols
  static contextType = MapContextType;
  context: MapContext = {} as MapContext;
  object: T | null = null;

  abstract addMapObject(map: OlMap): T;

  abstract updateMapObject(map: OlMap, object: T, prevProps: Readonly<P>): T;

  abstract removeMapObject(map: OlMap, object: T): void;

  getMapObject(id: string): OlBaseObject | null {
    return (this.context.mapObjects && this.context.mapObjects[id]) || null;
  }

  getOptions(): any {
    const options: any = { ...this.props };
    delete options.id;
    return options;
  }

  componentDidMount(): void {
    // console.log("MapComponent.componentDidMount: id =", this.props.id);
    this._updateMapObject(this.addMapObject(this.context.map!));
  }

  componentDidUpdate(prevProps: Readonly<P>): void {
    // console.log("MapComponent.componentDidUpdate: id =", this.props.id);
    this._updateMapObject(
      this.updateMapObject(this.context.map!, this.object!, prevProps),
    );
  }

  componentWillUnmount(): void {
    // console.log("MapComponent.componentWillUnmount: id =", this.props.id);
    const map = this.context.map!;
    this.removeMapObject(map, this.object!);
    if (this.props.id) {
      delete this.context.mapObjects![this.props.id!];
    }
    this.object = null;
  }

  private _updateMapObject(object: T) {
    if (object != null && this.props.id) {
      object.set("objectId", this.props.id);
      this.context.mapObjects![this.props.id!] = object;
    }
    this.object = object;
  }

  render(): React.ReactNode {
    return null;
  }
}
