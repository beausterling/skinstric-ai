const MAX_SIZE = 1280;

// draws the image (or video frame) on a canvas and returns it as base64 without the "data:image/jpeg;base64," part
function toBase64(
  source: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number,
  mirror = false,
) {
  const scale = Math.min(1, MAX_SIZE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d")!;
  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Please choose an image file"));
      img.onload = () => resolve(toBase64(img, img.width, img.height));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function videoToDataUrl(video: HTMLVideoElement) {
  return toBase64(video, video.videoWidth, video.videoHeight, true);
}

export function stripPrefix(dataUrl: string) {
  return dataUrl.split(",")[1];
}
