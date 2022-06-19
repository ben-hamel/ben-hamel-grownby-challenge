import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import SignUpForm from "./../components/signupScreen/SignUpForm/SignUpForm";

const LOGO = require("../assets/grownby-logo.png");

const SignUpScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} resizeMode={"contain"} />
      </View>
      <SignUpForm />
    </SafeAreaView>
  );
};

export default SignUpScreen;

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
