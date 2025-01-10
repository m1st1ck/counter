import {
  Dimensions,
  Insets,
  PixelRatio,
  Platform,
  StatusBar,
} from "react-native";

export const isIos = () => {
  return Platform.OS === "ios";
};

export const isAndroid = () => {
  return Platform.OS === "android";
};

export const wp = (widthPercent: number | string) => {
  // Parse string percentage input and convert it to number.
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

  const screenWidth = Dimensions.get("screen").width;

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
export const hp = (heightPercent: string | number) => {
  // Parse string percentage input and convert it to number.
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);
  const screenDimentions = Dimensions.get("screen");
  const screenHeight = isIos()
    ? screenDimentions.height
    : screenDimentions.height - Dimensions.get("window").height >
      (StatusBar.currentHeight || 0)
    ? Dimensions.get("window").height + (StatusBar.currentHeight || 0)
    : Dimensions.get("window").height;

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

const BASE_WIDTH = 390;
const BASE_HEIGHT = 790;

export const wpt = (points: number) => wp((points / BASE_WIDTH) * 100);
export const hpt = (points: number) => hp((points / BASE_HEIGHT) * 100);

export function startWithCapital(text: string): string;
export function startWithCapital(text?: string): string | undefined;
export function startWithCapital(text?: string) {
  if (!text) {
    return text;
  }
  return text.slice(0, 1).toUpperCase() + text.slice(1);
}

/**
 * single params will set all
 *
 * two params will set top and bottom, right and left
 *
 * three params will set top, right and left, bottom
 *
 * four params will set top, right, bottom, keft
 */
export const getInsets = (
  top: number,
  right?: number,
  bottom?: number,
  left?: number
): Required<Insets> => ({
  top,
  right: right ?? top,
  bottom: bottom ?? top,
  left: left ?? right ?? top,
});

export const getBoundNumber = (
  lowerBound: number,
  val: number,
  upperBound: number
) => {
  "worklet";
  if (val < lowerBound) {
    return lowerBound;
  }
  if (val > upperBound) {
    return upperBound;
  }
  return val;
};

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
