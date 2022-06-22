import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";

const width = Dimensions.get("window").width;

interface Props {
  text: string;
  onPress: () => void;
  type?: "filled" | "outlined";
  bordered?: boolean;
  size?: "large";
  testID?: string;
}

interface textStyle {
  color: string;
  fontSize: number;
  // textTransform: string;
  textAlign: string;
  // fontFamily: string;
}

const PrimaryButton = ({
  text,
  onPress,
  type = "filled",
  bordered = false,
  size = "large",
  testID,
}: Props) => {
  const large = "100%";
  const small = width / 2;
  const btnSize = size === "large" ? large : small;
  const btnBgColor = type === "filled" ? "#6dbe4b" : "transparent";
  const btnTextColor = type === "filled" ? "#ffffff" : "#6371c2";
  const btnBorderRadius = bordered ? 30 : 5;

  const containerCommonStyle = {
    backgroundColor: btnBgColor,
    paddingVertical: 8,
    width: btnSize,
    borderRadius: btnBorderRadius,
    textAlign: "center",
  };

  const textCommonStyle = {
    color: btnTextColor,
    fontSize: 16,
  };

  const border = type === "outlined" && {
    borderColor: "#6dbe4b",
    borderWidth: 2,
  };

  return (
    <Pressable onPress={onPress} testID={testID}>
      <View style={[containerCommonStyle, border]}>
        <Text style={[textCommonStyle]}> {text} </Text>
      </View>
    </Pressable>
  );
};

export default PrimaryButton;
