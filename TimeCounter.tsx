import { useReducer, useEffect } from "react";
import { getDurationFormatted } from "./utils";
import { Text } from "react-native";

export function TimeCounter({ from }: { from: number }) {
  const forceUpdate = useReducer(() => ({}), {})[1];

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [forceUpdate]);

  return <Text>{getDurationFormatted(Date.now() - from)}</Text>;
}
