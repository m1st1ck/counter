import React, { Fragment, useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Dialog from "react-native-dialog";

type Alert = {
  title?: string;
  type: "alert" | "prompt";
  message?: string;
  defaultValue?: string;
  actions?:
    | { text: string; color?: string; onPress?: () => void }[]
    | ((text: string) => void);
};

export function Alert() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const handleOpenAlert = useCallback(
    (
      title?: string,
      message?: string,
      actions?: Alert["actions"],
      defaultValue?: string
    ) => {
      setAlerts((prev) => [
        ...prev,
        { title, message, actions, defaultValue, type: "alert" },
      ]);
    },
    []
  );

  const handleOpenPrompt = useCallback(
    (
      title?: string,
      message?: string,
      actions?: Alert["actions"],
      defaultValue?: string
    ) => {
      setAlerts((prev) => [
        ...prev,
        { title, message, actions, defaultValue, type: "prompt" },
      ]);
    },
    []
  );

  useEffect(() => {
    Alert.prompt = handleOpenPrompt;
    Alert.alert = handleOpenAlert;
  }, [handleOpenAlert]);

  const inputValueRef = useRef<string>("");

  return (
    <>
      {alerts.map((alert, i) => (
        <Dialog.Container key={i} visible headerStyle={{ margin: 0 }}>
          {!!alert.title && (
            <Dialog.Title style={{ marginVertical: 12, color: "black" }}>
              {alert.title}
            </Dialog.Title>
          )}

          {!!alert.message && (
            <Dialog.Description style={{ marginTop: 0, marginBottom: 12 }}>
              {alert.message}
            </Dialog.Description>
          )}
          {typeof alert.actions === "object" && alert.actions.length >= 3 && (
            <View style={{}}>
              {alert.actions?.map((action, i) => (
                <Fragment key={i}>
                  <Dialog.Button
                    label={action.text}
                    color={action.color}
                    onPress={() => {
                      setAlerts((prev) => prev.slice(0, -1));
                      action.onPress?.();
                    }}
                  />

                  {i < alert.actions!.length - 1 && (
                    <View style={{ height: 1, backgroundColor: "lightgray" }} />
                  )}
                </Fragment>
              ))}
            </View>
          )}

          {typeof alert.actions === "object" &&
            alert.actions.length < 3 &&
            alert.actions?.map((action) => (
              <Dialog.Button
                label={action.text}
                color={action.color}
                onPress={() => {
                  setAlerts((prev) => prev.slice(0, -1));
                  action.onPress?.();
                }}
              />
            ))}

          {alert.type === "prompt" && (
            <Dialog.Input
              defaultValue={alert.defaultValue}
              onChangeText={(text) => {
                inputValueRef.current = text;
              }}
            />
          )}

          {!alert.actions && alert.type === "alert" && (
            <Dialog.Button
              label="Okay"
              onPress={() => {
                setAlerts((prev) => prev.slice(0, -1));
              }}
            />
          )}
          {typeof alert.actions === "function" && alert.type === "prompt" && (
            <Dialog.Button
              label="Cancel"
              onPress={() => {
                setAlerts((prev) => prev.slice(0, -1));
              }}
            />
          )}

          {typeof alert.actions === "function" && alert.type === "prompt" && (
            <Dialog.Button
              label="Okay"
              onPress={() => {
                setAlerts((prev) => prev.slice(0, -1));
                typeof alert.actions === "function" &&
                  alert.actions(inputValueRef.current);
              }}
            />
          )}
        </Dialog.Container>
      ))}
    </>
  );
}

Alert.alert = (_?: string, __?: string, ___?: Alert["actions"]) => {
  console.error("Alert not initialized");
};

Alert.prompt = (
  _?: string,
  __?: string,
  ___?: Alert["actions"],
  ____?: string
) => {
  console.error("Alert not initialized");
};
