import { isAfter, sub, add } from "date-fns";
import React from "react";
import { View, Pressable, Text } from "react-native";
import { useCountStore } from "./store";
import { TimeCounter } from "./TimeCounter";

export function Counter() {
  const lastSessionCounts = useCountStore().count.filter((date) =>
    isAfter(new Date(date), sub(new Date(), { hours: 2 }))
  );

  const groups = lastSessionCounts.reduce<string[][]>((acc, val) => {
    const lastGroup = acc.at(-1);

    if (!lastGroup) {
      return [[val]];
    }

    const lastEntry = lastGroup.at(-1);

    if (!lastEntry) {
      acc.at(-1)?.push(val);
      return acc;
    }

    if (isAfter(add(new Date(lastEntry), { seconds: 30 }), new Date(val))) {
      acc.at(-1)?.push(val);
      return acc;
    }

    acc.push([val]);

    return acc;
  }, []);

  const lastEntry = lastSessionCounts.at(-1);

  return (
    <View
      style={{
        gap: 4,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 4,
        }}
      >
        {groups.map((g, i) => {
          return (
            <View
              key={i}
              style={{
                borderWidth: 1,
                paddingHorizontal: 8,
                minWidth: 40,
                aspectRatio: "1/1",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text>{g.length}</Text>
            </View>
          );
        })}
      </View>

      {lastEntry && <TimeCounter from={new Date(lastEntry).getTime()} />}

      <Pressable
        style={{
          backgroundColor: "tomato",
          borderRadius: 8,
          width: 128,
          height: 128,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={useCountStore.getState().increment}
      >
        <Text
          style={{
            fontSize: 32,
            color: "white",
          }}
        >
          {lastSessionCounts.length}
        </Text>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "tomato",
          borderRadius: 8,
          width: 128,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={useCountStore.getState().decrement}
      >
        <Text
          style={{
            fontSize: 32,
            color: "white",
          }}
        >
          -
        </Text>
      </Pressable>
    </View>
  );
}
