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
  fontSize?: "small" | "inherit" | "medium" | "large";
  isToggle?: boolean
  exportResolution?: number;
}

export default function SnapshotButton({
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
    const targetElement: HTMLElement | null = mapRef && MAP_OBJECTS[mapRef]
      ? (MAP_OBJECTS[mapRef] as OlMap).getTargetElement()
      : elementRef?.current || null;

    const controlDiv: HTMLElement | null = targetElement
      ? targetElement.querySelector('.ol-unselectable.ol-control.MuiBox-root.css-0')
      : null;

    const zoomDiv: HTMLElement | null = targetElement
      ? targetElement.querySelector('.ol-zoom.ol-unselectable.ol-control')
      : null;

    const colorBarLegendDiv: HTMLElement | null = targetElement
      ? targetElement.querySelector('.MuiBox-root css-1dlw01u')
      : null;

    if (targetElement) {
      try {
        if (mapRef && MAP_OBJECTS[mapRef]) {
          const map = MAP_OBJECTS[mapRef] as OlMap;
          const originalSize = map.getSize() ?? [targetElement.clientWidth, targetElement.clientHeight];
          const originalResolution = map.getView().getResolution() ?? 1;
          const DPI = exportResolution ?? 96;
          const scaleFactor = DPI / 96;
          const exportWidth = Math.round(targetElement.clientWidth * scaleFactor);
          const exportHeight = Math.round(targetElement.clientHeight * scaleFactor);

          const originalWidth = targetElement.clientWidth;
          const originalHeight = targetElement.clientHeight;

          targetElement.style.width = `${exportWidth}px`;
          targetElement.style.height = `${exportHeight}px`;

          map.setSize([exportWidth, exportHeight]);
          const scaling = Math.min(
            exportWidth / originalSize[0],
            exportHeight / originalSize[1]
          );
          map.getView().setResolution(originalResolution / scaling);
          map.updateSize();

          if (colorBarLegendDiv) {
            const originalLegendWidth = colorBarLegendDiv.clientWidth;
            const originalLegendHeight = colorBarLegendDiv.clientHeight;

            const scaledLegendWidth = originalLegendWidth * scaleFactor;
            const scaledLegendHeight = originalLegendHeight * scaleFactor;

            colorBarLegendDiv.style.width = `${scaledLegendWidth}px`;
            colorBarLegendDiv.style.height = `${scaledLegendHeight}px`;
            colorBarLegendDiv.style.transformOrigin = 'top left';
            colorBarLegendDiv.style.transform = `scale(${scaleFactor})`;
          }
          exportElement(targetElement, {
            format: 'png',
            width: exportWidth,
            height: exportHeight,
            handleSuccess: () => {
              handleExportSuccess();
              setTimeout(() => {
                if (colorBarLegendDiv) {
                  colorBarLegendDiv.style.width = `${colorBarLegendDiv.clientWidth}px`;
                  colorBarLegendDiv.style.height = `${colorBarLegendDiv.clientHeight}px`;
                  colorBarLegendDiv.style.transform = 'none';
                }

                map.setSize(originalSize);
                map.getView().setResolution(originalResolution);
                map.updateSize();

                targetElement.style.width = `${originalWidth}px`;
                targetElement.style.height = `${originalHeight}px`;
              }, 1000);
            },
            handleError: handleExportError,
            controlDiv,
            zoomDiv,
          });
        } else {
          // const DPI = exportResolution ?? 96;
          // const scaleFactor = DPI / 96;
          // const exportWidth = Math.round(targetElement.clientWidth * scaleFactor);
          // const exportHeight = Math.round(targetElement.clientHeight * scaleFactor);

          // targetElement.style.width = `${exportWidth}px`;
          // targetElement.style.height = `${exportHeight}px`;

          exportElement(targetElement, {
            format: 'png',
            handleSuccess: handleExportSuccess,
            handleError: handleExportError,
            controlDiv,
            zoomDiv,
          });
        }
      } catch (error) {
        handleExportError(error);
      }
    } else {
      handleExportError(new Error("missing element reference"));
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
