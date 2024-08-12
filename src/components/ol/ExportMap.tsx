import { Map as OlMap } from "ol";

export const exportMapAsImage = (
  map: OlMap,
  //format: string = "a4",
  resolution: number = 2,
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
    mapCanvas.width = 800 * resolution;
    mapCanvas.height = 800 * resolution;
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

    const dataURL = mapCanvas.toDataURL("image/png");

    let image = new Image();
    image.crossOrigin = "anonymous";
    image.src = dataURL;

    image.onload = () => {
      mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
      mapContext.drawImage(image, mapCanvas.width / 2 - 40, 25, 80, 120);

      mapCanvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(
            () => {
              //TODO- Add this to dispatch and remove below code
              alert("Map image copied to clipboard.");
            },
            (error) => {
              console.error("Error copying image to clipboard: ", error);
              alert("Failed to copy map image to clipboard.");
            }
          );
        }
      }, "image/png");

      map.setSize(size);
      document.body.style.cursor = "auto";
    };
  }
};