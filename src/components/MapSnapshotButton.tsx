/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { RefObject } from "react";
import { default as OlMap } from "ol/Map";
import { MAP_OBJECTS } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
import { WithLocale } from "@/util/lang";
import MapButton from "@/components/Viewer/MapButton";
import i18n from "@/i18n";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useCopySnapshotToClipboard } from "@/hooks/useCopySnapshotToClipboard";

export function getMapElement(): RefObject<HTMLDivElement | null> {
  const targetElement = MAP_OBJECTS["map"]
    ? (MAP_OBJECTS["map"] as OlMap).getTargetElement()
    : null;
  return { current: targetElement as HTMLDivElement | null };
}

export function getHiddenElements(element: HTMLElement | null) {
  if (!element) return [];
  return [
    element.querySelector(".ol-unselectable.ol-control.MuiBox-root.css-0"),
    element.querySelector(".ol-zoom.ol-unselectable.ol-control"),
  ].filter(Boolean) as HTMLElement[];
}

interface MapSnapshotButtonProps extends WithLocale {
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function MapSnapshotButton({
  postMessage,
}: MapSnapshotButtonProps) {
  const elementRef = getMapElement();
  const hiddenElements = (root: HTMLElement) => getHiddenElements(root);

  const exportOptions = {
    pixelRatio: 1,
    hiddenElements,
    postMessage,
  };

  const { onSnapshotClick } = useCopySnapshotToClipboard(
    elementRef,
    exportOptions,
  );

  return (
    <MapButton
      icon={<CameraAltIcon fontSize="small" />}
      tooltipTitle={i18n.get("Copy snapshot to clipboard")}
      onClick={onSnapshotClick}
    />
  );
}
