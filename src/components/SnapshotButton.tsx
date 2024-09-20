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
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { default as OlMap } from "ol/Map";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { MessageType } from "@/states/messageLogState";
import { exportElement } from "@/util/export";
import ToolButton from "@/components/ToolButton";
import { MAP_OBJECTS } from "@/states/controlState";

interface SnapshotButtonProps extends WithLocale {
  elementRef?: RefObject<HTMLDivElement | null>;
  mapRef?: string;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  fontSize?: 'small' | 'inherit' | 'medium' | 'large';
  isToggle?: boolean
}

export default function SnapshotButton({
  elementRef,
  mapRef,
  postMessage,
  fontSize = "inherit",
  isToggle = false,
}: SnapshotButtonProps) {
  const pixelRatio = 1;

  const handleExportSuccess = () => {
    postMessage("success", i18n.get("Snapshot copied to clipboard"));
  };

  const handleExportError = (error: unknown) => {
    const message = "Error copying snapshot to clipboard";
    console.error(message + ":", error);
    postMessage("error", i18n.get(message));
  };

  const handleButtonClick = async () => {
    const targetElement: HTMLElement | null = mapRef && MAP_OBJECTS[mapRef]
      ? (MAP_OBJECTS[mapRef] as OlMap).getTargetElement()
      : elementRef?.current || null;
    const controlDiv: HTMLElement | null = targetElement
      ? targetElement.querySelector('.ol-unselectable.ol-control.MuiBox-root.css-0')
      : null;
    const zoomDiv: HTMLElement | null = targetElement
      ? targetElement.querySelector('.ol-zoom.ol-unselectable.ol-control')
      : null;
    if (targetElement) {
      try {
        exportElement(targetElement, {
          format: 'png',
          width: 2000,
          handleSuccess: handleExportSuccess,
          handleError: handleExportError,
          pixelratio: pixelRatio,
          controlDiv,
          zoomDiv,
        });
      } catch (error) {
        handleExportError(error);
      }
    } else {
      handleExportError(new Error('missing element reference'));
    }
  };


  return (
    <ToolButton
      tooltipText={i18n.get("Copy snapshot to clipboard")}
      onClick={handleButtonClick}
      toggle={isToggle}
      icon={<CameraAltIcon fontSize={fontSize} />}
    />
  );
}
