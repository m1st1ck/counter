import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StatusBar,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import { Counter } from "./Counter";
import { AntDesign } from "@expo/vector-icons";
import { useCountersStore } from "./useCountersStore";
import { useCountStore } from "./store";

export default function App() {
  const [activeCounter, setActiveCounter] = useState(0);

  useEffect(() => {
    const count = useCountStore.getState().count;
    const counters = useCountersStore.getState().counters;
    if (count.length && !counters.length) {
      useCountersStore.setState({
        counters: [{ name: "PL", count }],
      });

      useCountStore.setState({ count: [] });
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          marginTop: 8,
        }}
      >
        <CounterSelector
          activeCounter={activeCounter}
          setActiveCounter={setActiveCounter}
        />
      </View>

      {/* <AccelerationTracker /> */}

      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Calendar index={activeCounter} />
      </View>

      <View style={{ flex: 1 }}></View>

      <Counter index={activeCounter} />

      <View style={{ flex: 1 }}></View>

      <Pressable
        style={{
          padding: 16,
        }}
        onPress={() => {
          const fileUri = FileSystem.documentDirectory + "pullups.json";

          FileSystem.writeAsStringAsync(
            fileUri,
            JSON.stringify(useCountersStore.getState().counters),
            {
              encoding: FileSystem.EncodingType.UTF8,
            }
          );

          const UTI = "pullups.json";

          Sharing.shareAsync(fileUri, { UTI }).catch((error) => {
            console.log(error);
          });
        }}
      >
        <Text style={{ textAlign: "center" }}>Export</Text>
      </Pressable>

      <View style={{ flex: 1 }}></View>
    </SafeAreaView>
  );
}

function CounterSelector({
  activeCounter,
  setActiveCounter,
}: {
  activeCounter: number;
  setActiveCounter: (index: number) => void;
}) {
  const counters = useCountersStore().counters;

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 16,
        }}
      >
        {counters.map((counter, index) => (
          <Pressable
            key={index}
            style={{
              borderRadius: 100,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              padding: 4,
              borderColor: index === activeCounter ? "tomato" : undefined,
            }}
            onLongPress={() => {
              Alert.alert("Options", undefined, [
                {
                  text: "Rename",
                  onPress: () => {
                    Alert.prompt(
                      "Name?",
                      undefined,
                      (text) => {
                        useCountersStore.getState().renameCounter(index, text);
                      },
                      undefined,
                      counter.name
                    );
                  },
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    Alert.alert(
                      "Delete counter?",
                      "Are you sure, the process is irreversible?",
                      [
                        {
                          style: "destructive",
                          text: "Delete",
                          onPress: () => {
                            useCountersStore.getState().deleteCounter(index);
                          },
                        },
                        {
                          text: "Cancel",
                          isPreferred: true,
                        },
                      ]
                    );
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ]);
            }}
            onPress={() => {
              setActiveCounter(index);
            }}
          >
            <Text adjustsFontSizeToFit numberOfLines={1}>
              {counter.name}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={{
            borderRadius: 100,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
          }}
          onPress={() => {
            Alert.prompt("Name?", undefined, (text) => {
              useCountersStore.getState().addCounter(text);
            });
          }}
        >
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
