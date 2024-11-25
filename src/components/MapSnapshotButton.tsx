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

import { RefObject } from "react";
import { default as OlMap } from "ol/Map";
import SnapshotButton from "./SnapshotButton";
import { MAP_OBJECTS } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
import { WithLocale } from "@/util/lang";

interface MapSnapshotButtonProps extends WithLocale {
    mapRef: string;
    postMessage: (messageType: MessageType, messageText: string | Error) => void;
    fontSize?: "small" | "inherit" | "medium" | "large";
    isToggle?: boolean;
}

export default function MapSnapshotButton({
    mapRef,
    postMessage,
    fontSize = "inherit",
    isToggle = false,
}: MapSnapshotButtonProps) {
    const getMapElement = (): RefObject<HTMLDivElement | null> => {
        const targetElement = MAP_OBJECTS[mapRef]
            ? (MAP_OBJECTS[mapRef] as OlMap).getTargetElement()
            : null;
        return { current: targetElement as HTMLDivElement | null };
    };

    const getHiddenElements = (element: HTMLDivElement | null): HTMLElement[] => {
        if (!element) return [];
        return [
            element.querySelector(".ol-unselectable.ol-control.MuiBox-root.css-0"),
            element.querySelector(".ol-zoom.ol-unselectable.ol-control"),
        ].filter(Boolean) as HTMLElement[];
    };

    const elementRef = getMapElement();
    const hiddenElements = getHiddenElements(elementRef.current);

    return (
        <SnapshotButton
            elementRef={elementRef}
            hiddenElements={hiddenElements}
            postMessage={postMessage}
            fontSize={fontSize}
            isToggle={isToggle}
        />
    );
}
