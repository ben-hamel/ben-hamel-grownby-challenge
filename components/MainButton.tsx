import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  children: string;
  style?: any;
  onPress: () => void;
}

const MainButton = ({ children, style, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.mainButton, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  mainButton: {
    backgroundColor: "#00b5ec",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
});
