import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCountStore } from "./store";
import {
  add,
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isAfter,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import React from "react";
import { getDurationFormatted } from "./utils";

const weeks = [0, 1, 2, 3, 4, 5];
const daysInWeek = [0, 1, 2, 3, 4, 5, 6];

export function Calendar() {
  const counts = useCountStore().count;

  const groups = counts.reduce<string[][]>((acc, val) => {
    const lastGroup = acc.at(-1);

    if (!lastGroup) {
      return [[val]];
    }

    const lastEntry = lastGroup.at(-1);

    if (!lastEntry) {
      acc.at(-1)?.push(val);
      return acc;
    }

    if (isAfter(add(new Date(lastEntry), { hours: 2 }), new Date(val))) {
      acc.at(-1)?.push(val);
      return acc;
    }

    acc.push([val]);

    return acc;
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSessions, setSelectedSessions] = useState<string[][] | null>(
    null
  );

  const startOfTheMonth = startOfMonth(selectedDate);

  const dayOfTheWeekOfStart =
    getDay(startOfTheMonth) === 0 ? 7 : getDay(startOfTheMonth) - 1; // 0 === Sunday

  const daysInTheMonth = getDaysInMonth(startOfTheMonth);

  return (
    <>
      <View style={{ marginTop: 64, gap: 4 }}>
        <Text
          style={{
            color: "tomato",
            fontWeight: "600",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          {format(selectedDate, "MMM yyyy")}
        </Text>
        {weeks.map((week) => (
          <View key={week} style={{ flexDirection: "row", gap: 4 }}>
            {daysInWeek.map((dayInWeek) => {
              const dayNumber = week * daysInWeek.length + dayInWeek;
              const date = addDays(
                startOfTheMonth,
                dayNumber - dayOfTheWeekOfStart
              );

              const sessionsForDay = groups.filter((stats) =>
                isSameDay(stats[0] && new Date(stats[0]), date)
              );

              const entriesInLastSession = sessionsForDay.at(-1);

              return (
                <Pressable
                  key={dayInWeek}
                  onPress={
                    entriesInLastSession
                      ? () => {
                          setSelectedSessions(sessionsForDay);
                        }
                      : undefined
                  }
                  style={{
                    borderWidth: 1,
                    aspectRatio: "1/1",
                    flex: 1,
                    paddingVertical: 1,
                    paddingHorizontal: 3,
                    borderRadius: 4,
                    borderColor:
                      dayNumber < dayOfTheWeekOfStart ||
                      dayNumber - dayOfTheWeekOfStart + 1 > daysInTheMonth
                        ? "lightgray"
                        : isSameDay(new Date(), date)
                        ? "tomato"
                        : "black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "right",
                      flex: 1,
                      color: isSameDay(new Date(), date) ? "tomato" : "gray",
                    }}
                  >
                    {format(date, "d")}
                  </Text>

                  {entriesInLastSession && (
                    <>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          top: 0,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 18,
                            color: "deepskyblue",
                            fontWeight: "600",
                          }}
                        >
                          {sessionsForDay.reduce(
                            (acc, val) => acc + val.length,
                            0
                          )}
                        </Text>
                      </View>
                      {sessionsForDay.length === 1 && (
                        <Text style={{ textAlign: "center", fontSize: 11 }}>
                          {getDurationFormatted(
                            new Date(
                              entriesInLastSession.at(-1) ??
                                entriesInLastSession.at(0)!
                            ).getTime() -
                              new Date(entriesInLastSession.at(0)!).getTime()
                          )}
                        </Text>
                      )}
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => {
              setSelectedDate(subMonths(selectedDate, 1));
            }}
          >
            <Text style={{ color: "deepskyblue", fontSize: 18 }}>Prev</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setSelectedDate(addMonths(selectedDate, 1));
            }}
          >
            <Text style={{ color: "deepskyblue", fontSize: 18 }}>Next</Text>
          </Pressable>
        </View>
      </View>

      {selectedSessions !== null && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onPress={() => {
              setSelectedSessions(null);
            }}
          />
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 4,
              padding: 8,
              gap: 8,
            }}
          >
            {selectedSessions.map((entries, i) => {
              const groups = entries.reduce<string[][]>((acc, val) => {
                const lastGroup = acc.at(-1);

                if (!lastGroup) {
                  return [[val]];
                }

                const lastEntry = lastGroup.at(-1);

                if (!lastEntry) {
                  acc.at(-1)?.push(val);
                  return acc;
                }

                if (
                  isAfter(
                    add(new Date(lastEntry), { seconds: 30 }),
                    new Date(val)
                  )
                ) {
                  acc.at(-1)?.push(val);
                  return acc;
                }

                acc.push([val]);

                return acc;
              }, []);

              return (
                <View key={i}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{entries.length}</Text>

                    <Text>
                      {getDurationFormatted(
                        new Date(entries.at(-1) ?? entries.at(0)!).getTime() -
                          new Date(entries.at(0)!).getTime()
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {groups.map((g, i) => {
                      return (
                        <View key={i}>
                          <View
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

                          <Text style={{ fontSize: 12, textAlign: "center" }}>
                            {i === groups.length - 1
                              ? ""
                              : getDurationFormatted(
                                  new Date(
                                    groups[i + 1].at(-1) ?? groups[i + 1].at(0)!
                                  ).getTime() -
                                    new Date(groups[i].at(0)!).getTime()
                                )}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </>
  );
}
