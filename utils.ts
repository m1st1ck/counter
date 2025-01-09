export const getDurationFormatted = (millis: number): string => {
  const minutes = Math.floor(millis / 60000);

  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export function interpolate(
  x: number,
  [x1, x2]: [number, number],
  [y1, y2]: [number, number]
) {
  return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
}
