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
  isToggle?: boolean;
  exportResolution?: number;
}

export default function SnapshotButton({
  //btnKey,
  elementRef,
  mapRef,
  postMessage,
  fontSize = "inherit",
  isToggle = false,
  exportResolution
}: SnapshotButtonProps) {

  const handleExportSuccess = () => {
    postMessage("success", i18n.get("Snapshot copied to clipboard"));
  };

  const handleExportError = (error: unknown) => {
    const message = "Error copying snapshot to clipboard";
    console.error(message + ":", error);
    postMessage("error", i18n.get(message));
  };

  const handleButtonClick = async () => {
    let targetElement: HTMLElement | null = null;
    let controlDiv: HTMLElement | null = null;
    let zoomDiv: HTMLElement | null = null;

    if (mapRef) {
      if (MAP_OBJECTS[mapRef]) {
        const map = MAP_OBJECTS[mapRef] as OlMap;
        targetElement = map.getTargetElement();
        controlDiv = targetElement.querySelector('.ol-unselectable.ol-control.MuiBox-root.css-0') as HTMLElement;
        zoomDiv = targetElement.querySelector(".ol-zoom.ol-unselectable.ol-control") as HTMLElement;

        const originalSize = map.getSize() ?? [targetElement.clientWidth, targetElement.clientHeight];
        const originalResolution = map.getView().getResolution() ?? 1;
        const DPI = exportResolution ?? 96;
        const scaleFactor = DPI / 96;

        // Calculate export dimensions
        const exportWidth = Math.round(targetElement.clientWidth * scaleFactor);
        const exportHeight = Math.round(targetElement.clientHeight * scaleFactor);

        // Save original dimensions and transformation
        const originalWidth = targetElement.clientWidth;
        const originalHeight = targetElement.clientHeight;
        const originalTransform = targetElement.style.transform;

        // Apply new size and scale
        targetElement.style.width = `${exportWidth}px`;
        targetElement.style.height = `${exportHeight}px`;
        targetElement.style.transformOrigin = 'top left';
        targetElement.style.transform = `scale(${scaleFactor})`;

        map.setSize([exportWidth, exportHeight]);

        const scaling = Math.min(
          exportWidth / originalSize[0],
          exportHeight / originalSize[1]
        );

        map.getView().setResolution(originalResolution / scaling);

        map.updateSize();

        try {
          await exportElement(targetElement, {
            format: "png",
            handleSuccess: handleExportSuccess,
            handleError: handleExportError,
            width: exportWidth,
            height: exportHeight,
            controlDiv: controlDiv,
            zoomDiv: zoomDiv,
          });
        } catch (error) {
          handleExportError(error);
        }
        //finally {
        //   // Restore original dimensions and transformation
        //   targetElement.style.transform = originalTransform;
        //   targetElement.style.width = `${originalWidth}px`;
        //   targetElement.style.height = `${originalHeight}px`;

        //   map.setSize(originalSize);
        //   map.getView().setResolution(originalResolution);
        //   map.updateSize();
        // }
      }
    } else if (elementRef) {
      if (elementRef.current) {
        targetElement = elementRef.current;
      }
    }
  };

  // const handleButtonClick = async () => {
  //   let targetElement: HTMLElement | null = null;
  //   let controlDiv: HTMLElement | null = null;
  //   let zoomDiv: HTMLElement | null = null;

  //   if (mapRef) {
  //     if (MAP_OBJECTS[mapRef]) {
  //       const map = MAP_OBJECTS[mapRef] as OlMap;
  //       targetElement = map.getTargetElement();
  //       controlDiv = targetElement.querySelector('.ol-unselectable.ol-control.MuiBox-root.css-0') as HTMLElement;
  //       zoomDiv = targetElement.querySelector(".ol-zoom.ol-unselectable.ol-control") as HTMLElement;
  //     }
  //   } else if (elementRef) {
  //     if (elementRef.current) {
  //       targetElement = elementRef.current;
  //     }
  //   }

  //   if (targetElement) {
  //     try {
  //       // Pass controlDiv as part of ExportOptions
  //       exportElement(targetElement, {
  //         format: "png",
  //         handleSuccess: handleExportSuccess,
  //         handleError: handleExportError,
  //         exportResolution: exportResolution,
  //         controlDiv: controlDiv,
  //         zoomDiv: zoomDiv,
  //       });
  //     } catch (error) {
  //       handleExportError(error);
  //     }
  //   } else {
  //     handleExportError(new Error("missing element reference"));
  //   }
  // };

  return (
    <ToolButton
      //key={btnKey}
      tooltipText={i18n.get("Copy snapshot to clipboard")}
      onClick={handleButtonClick}
      toggle={isToggle}
      icon={<CameraAltIcon fontSize={fontSize} />}
    />
  );
}
