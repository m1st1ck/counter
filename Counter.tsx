import { isAfter, sub, add } from "date-fns";
import React, { useEffect, useRef } from "react";
import { View, Pressable, Text, ScrollView } from "react-native";
import { TimeCounter } from "./TimeCounter";
import { useCountersStore } from "./useCountersStore";
import { wp } from "./utils";

export function Counter({ index }: { index: number }) {
  const lastSessionCounts =
    useCountersStore()
      .counters.at(index)
      ?.count.filter((date) =>
        isAfter(new Date(date), sub(new Date(), { hours: 2 }))
      ) || [];

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

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ animated: false, x: 0 });
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 69);
  }, [index]);

  return (
    <View
      style={{
        gap: 4,
        alignItems: "center",
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 4,
          paddingHorizontal: wp(50) - 20,
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
      </ScrollView>

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
        onPress={() => {
          scrollRef.current?.scrollToEnd({ animated: true });
          useCountersStore.getState().increment(index);
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 69);
        }}
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
        onPress={() => {
          scrollRef.current?.scrollToEnd({ animated: true });
          useCountersStore.getState().decrement(index);
        }}
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
