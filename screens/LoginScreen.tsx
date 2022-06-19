import { StyleSheet, Text, Image, View } from "react-native";
import React from "react";
import LoginForm from "../components/loginScreen/LoginForm/LoginForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const LOGO = require("../assets/grownby-logo.png");

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>LoginScreen</Text> */}
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} resizeMode={"contain"} />
      </View>
      <LoginForm />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#b3c4b9",
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 250,
  },
});
