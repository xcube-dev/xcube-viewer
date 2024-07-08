import { Map as OlMap } from "ol";

const dims: { [key: string]: [number, number] } = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

export const exportMapAsImage = (
  map: OlMap,
  // format: string = "a4",
  // resolution: number = 150,
) => {
  const mapElement = map.getTargetElement();
  if (!mapElement) {
    console.error("Map element not found.");
    document.body.style.cursor = "auto";
    return;
  }
  const mapCanvas = document.createElement("canvas");
  const size = map.getSize();
  if (size) {
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
  }
  const mapContext = mapCanvas.getContext("2d");

  if (mapContext) {
    Array.prototype.forEach.call(
      document.querySelectorAll(".ol-layer canvas"),
      (canvas: HTMLCanvasElement) => {
        if (canvas.width > 0) {
          const opacity = canvas.style.opacity || 1;
          mapContext.globalAlpha = Number(opacity);
          const transform = canvas.style.transform;
          const matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)?.[1]
            .split(",")
            .map(Number) || [1, 0, 0, 1, 0, 0];
          mapContext.setTransform(
            matrix[0],
            matrix[1],
            matrix[2],
            matrix[3],
            matrix[4],
            matrix[5],
          );
          mapContext.drawImage(canvas, 0, 0);
        }
      },
    );

    mapContext.globalAlpha = 1;
    mapContext.setTransform(1, 0, 0, 1, 0, 0);

    mapCanvas.toBlob((blob) => {
      if (blob) {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(
          () => {
            alert("Map image copied to clipboard.");
          },
          (error) => {
            console.error("Error copying image to clipboard: ", error);
            alert("Failed to copy map image to clipboard.");
          },
        );
      }

      map.setSize(size);
      document.body.style.cursor = "auto";
    });
  }
};
