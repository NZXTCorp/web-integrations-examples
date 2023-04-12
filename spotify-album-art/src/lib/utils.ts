import { Track as TrackType, Episode } from "spotify-types";

export const isTrack = (item: TrackType | Episode): item is TrackType => {
  return item.type === "track";
};

export const isPodcast = (item: TrackType | Episode): item is Episode => {
  return item.type === "episode";
};

export function averageColor(imageRef: HTMLImageElement, step: number) {
  return new Promise<string>((resolve, reject) => {
    imageRef.crossOrigin = "Anonymous";
    imageRef.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const imgWidth = imageRef.width;
      const imgHeight = imageRef.height;
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      if (!ctx) {
        reject("Could not get canvas context");
        return;
      }
      ctx.drawImage(imageRef, 0, 0, imgWidth, imgHeight);
      const pixelData = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      const count = Math.floor((imgWidth * imgHeight) / (step * step));
      for (let y = 0; y < imgHeight; y += step) {
        for (let x = 0; x < imgWidth; x += step) {
          const pixelIndex = (y * imgWidth + x) * 4;
          red += pixelData[pixelIndex];
          green += pixelData[pixelIndex + 1];
          blue += pixelData[pixelIndex + 2];
        }
      }
      red = Math.round(red / count);
      green = Math.round(green / count);
      blue = Math.round(blue / count);
      const hexValue =
        "#" +
        ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
      resolve(hexValue);
    };
  });
}
