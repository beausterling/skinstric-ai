// how far the first and last letters sit inside the text box,
// so a line can start and end exactly on the letters.
// the text is drawn on a hidden canvas and the columns with ink are counted,
// because measureText does not report the ink edges in Safari
export function letterEdges(text: string, element: HTMLElement) {
  const none = { left: 0, right: 0 };
  if (!text.trim()) return none;

  const style = getComputedStyle(element);
  const size = Math.ceil(parseFloat(style.fontSize));
  const padding = parseFloat(style.paddingLeft) || 0;
  const scale = 3;
  const margin = size;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return none;

  const setFont = () => {
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.letterSpacing = style.letterSpacing;
  };

  setFont();
  // the width of the text box, letter spacing is also added after the last letter
  const textWidth = context.measureText(text).width;

  // changing the size clears the canvas settings, so the font is set again
  canvas.width = Math.ceil(textWidth + margin * 2) * scale;
  canvas.height = size * 3 * scale;
  context.scale(scale, scale);
  setFont();
  context.fillText(text, margin, size * 2);

  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  let first = -1;
  let last = -1;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // only count pixels that are mostly filled in
      if (data[(y * width + x) * 4 + 3] > 128) {
        if (first < 0) first = x;
        last = x;
        break;
      }
    }
  }
  if (first < 0) return none;

  return {
    left: padding + first / scale - margin,
    right: padding + textWidth - ((last + 1) / scale - margin),
  };
}
