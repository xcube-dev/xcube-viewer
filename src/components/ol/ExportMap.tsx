import { Map as OlMap } from "ol";

export const exportMapAsImage = (
  map: OlMap,
  resolution: number = 4
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
    const width = size[0];
    const height = size[1];


    mapCanvas.width = width * resolution;
    mapCanvas.height = height * resolution;
  }

  const mapContext = mapCanvas.getContext("2d");

  if (mapContext) {

    mapContext.scale(resolution, resolution);


    Array.prototype.forEach.call(
      document.querySelectorAll(".ol-viewport canvas, .ol-unselectable .ol-control"),
      (canvas: HTMLCanvasElement) => {
        if (canvas.width > 0) {
          const opacity = canvas.style.opacity || 1;
          mapContext.globalAlpha = Number(opacity);
          let matrix: number[];
          const transform = canvas.style.transform;
          if (transform) {
            matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)?.[1]
              .split(',')
              .map(Number) || [1, 0, 0, 1, 0, 0];
          } else {
            matrix = [
              parseFloat(canvas.style.width) / canvas.width || 1,
              0,
              0,
              parseFloat(canvas.style.height) / canvas.height || 1,
              0,
              0,
            ];
          }

          if (matrix.length === 6) {
            mapContext.setTransform(
              matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]
            );
          }
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

      mapContext.drawImage(
        image,
        0, 0,
        mapCanvas.width,
        mapCanvas.height
      );

      mapCanvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(
            () => {
              alert("map image copied to clipboard.");
            },
            (error) => {
              console.error("Error copying image to clipboard: ", error);
              alert("Failed to copy map image to clipboard.");
            }
          );
        }
      }, "image/png");

      document.body.style.cursor = "auto";
    };
  }
};
