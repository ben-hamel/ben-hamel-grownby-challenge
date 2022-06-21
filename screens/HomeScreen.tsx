import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./../config/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";

import FarmList from "../components/FarmList";
import AddFarmModal from "../components/AddFarmModal";

const LOGO = require("../assets/grownby-logo.png");

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("signed out");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("singout error");
        console.log("error code" + errorCode);
        console.log("error message" + errorMessage);
      });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.logoContainer}>
          <Image source={LOGO} style={styles.logo} resizeMode={"contain"} />
        </View>
        <Pressable style={styles.button} onPress={() => toggleModal()}>
          <Text style={styles.buttonText}>Add farm</Text>
        </Pressable>
      </View>
      <PrimaryButton
        text={"Sign Out"}
        size={"large"}
        onPress={() => signOutUser()}
        data-cy="sign-out-button"
      />
      <FarmList modalState={modalVisible} />
      <AddFarmModal modalVisible={modalVisible} toggleModal={toggleModal} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#b3c4b9",
    flex: 1,
  },

  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2f5d40",
    paddingHorizontal: 20,
  },
  logoContainer: {},
  logo: {
    width: 150,
    height: 78,
  },
  button: {
    backgroundColor: "#6dbe4b",
    paddingVertical: 10,
    borderRadius: 6,
    padding: 10,
  },
  buttonText: { color: "white", fontSize: 16 },
  modal: {
    backgroundColor: "white",
    padding: 20,
  },
  inputField: {
    backgroundColor: "white",
    padding: 12,

    borderWidth: 1,
    borderRadius: 5,
  },
  error: { color: "red" },
});
