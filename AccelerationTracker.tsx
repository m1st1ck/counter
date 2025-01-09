import { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import { Canvas, interpolate, Points, vec } from "@shopify/react-native-skia";
import React from "react";

export function AccelerationTracker() {
  const [data, setData] = useState({
    acceleration: {
      x: 0,
      y: 0,
      z: 0,
    },
    accelerationIncludingGravity: {
      x: 0,
      y: 0,
      z: 0,
    },
  });

  const dataEntries = useRef<number[]>([]);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(20);
    const sub = DeviceMotion.addListener((data) => {
      const gX = Math.abs(
        (data.accelerationIncludingGravity?.x ?? 0) -
          (data.acceleration?.x ?? 0)
      );
      const gY = Math.abs(
        (data.accelerationIncludingGravity?.y ?? 0) -
          (data.acceleration?.y ?? 0)
      );
      const gZ = Math.abs(
        (data.accelerationIncludingGravity?.z ?? 0) -
          (data.acceleration?.z ?? 0)
      );

      const totalGravity = gX + gY + gZ;

      const xUp = gX / totalGravity;
      const yUp = gY / totalGravity;
      const zUp = gZ / totalGravity;

      // console.log({ xUp, yUp, zUp, total: xUp + yUp + zUp });

      const upwardAcceleratio =
        Math.round(
          ((data.acceleration?.x ?? 0) * xUp +
            (data.acceleration?.y ?? 0) * yUp +
            (data.acceleration?.z ?? 0) * zUp) *
            1
        ) / 1;

      console.log({ upwardAcceleratio });

      if (data.accelerationIncludingGravity) {
        if (dataEntries.current.length > 1024) {
          dataEntries.current.shift();
        }
        dataEntries.current.push(upwardAcceleratio);
      }
      setData({
        acceleration: {
          z: data.acceleration?.z ?? 0,
          y: data.acceleration?.y ?? 0,
          x: data.acceleration?.x ?? 0,
        },
        accelerationIncludingGravity: {
          z: data.accelerationIncludingGravity?.z,
          y: data.accelerationIncludingGravity?.y,
          x: data.accelerationIncludingGravity?.x,
        },
      });
    });

    return () => {
      sub.remove();
    };
  }, []);

  const smallest = dataEntries.current.reduce(
    (acc, val) => (acc > val ? val : acc),
    0
  );
  const largest = dataEntries.current.reduce(
    (acc, val) => (acc > val ? acc : val),
    0
  );

  const step = 256 / dataEntries.current.length;

  return (
    <View>
      <View
        style={{
          height: 256,
          width: 256,
          borderWidth: 1,
        }}
      >
        <Canvas style={{ flex: 1 }}>
          <Points
            // points={[vec(0, 256), vec(0, 0), vec(256, 256)]}
            points={dataEntries.current.map((entry, index) => {
              return vec(
                index * step,
                interpolate(entry, [smallest, largest], [256, 0])
              );
            })}
            mode="polygon"
            color="lightblue"
            style="stroke"
            strokeWidth={4}
          />
        </Canvas>
      </View>

      <Text>{JSON.stringify(data, undefined, 2)}</Text>

      <Text>
        y:
        {(data.accelerationIncludingGravity?.y ?? 0) -
          (data.acceleration?.y ?? 0)}
      </Text>
      <Text>
        z:
        {(data.accelerationIncludingGravity?.z ?? 0) -
          (data.acceleration?.z ?? 0)}
      </Text>
      <Text>
        x:
        {(data.accelerationIncludingGravity?.x ?? 0) -
          (data.acceleration?.x ?? 0)}
      </Text>

      <Text>
        {(data.accelerationIncludingGravity?.x ?? 0) -
          (data.acceleration?.x ?? 0) +
          (data.accelerationIncludingGravity?.y ?? 0) -
          (data.acceleration?.y ?? 0) +
          (data.accelerationIncludingGravity?.z ?? 0) -
          (data.acceleration?.z ?? 0)}
      </Text>
    </View>
  );
}
