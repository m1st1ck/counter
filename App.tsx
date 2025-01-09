import { Pressable, Text, View } from "react-native";
import { useCountStore } from "./store";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Calendar } from "./Calendar";
import { Counter } from "./Counter";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <StatusBar style="dark" />
      {/* <AccelerationTracker /> */}

      <Calendar />

      <Counter />

      <View style={{ flex: 1 }}></View>

      <Pressable
        style={{
          padding: 16,
        }}
        onPress={() => {
          const fileUri = FileSystem.documentDirectory + "pullups.json";

          FileSystem.writeAsStringAsync(
            fileUri,
            JSON.stringify(useCountStore.getState().count),
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
    </View>
  );
}
