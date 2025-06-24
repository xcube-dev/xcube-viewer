/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
