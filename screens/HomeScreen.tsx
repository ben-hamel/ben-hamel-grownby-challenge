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
import * as Yup from "yup";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import { storage, db } from "./../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import FarmList from "../components/FarmList";

const LOGO = require("../assets/grownby-logo.png");

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  // const [imgUrl, setImgUrl] = React.useState("");

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
    // console.log("add farm");
    setModalVisible(!modalVisible);
  };

  const addFarmToDB = async (values) => {
    console.log("add farm to db");
    console.log(values);
    const docRef = await addDoc(collection(db, "Farms"), values);
    console.log("Document written with ID: ", docRef.id);
    toggleModal();
  };

  const pickImage = async (
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("result", result);

    if (!result.cancelled) {
      const storageRef = ref(storage, "image.jpg");

      const img = await fetch(result.uri);
      const blob = await img.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log("error", error);
        },
        () => {
          console.log("Upload completed");
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log("url", url);
            // setImgUrl(url);
            setFieldValue("image", url);
          });
        }
      );
    }
  };

  const addFarmSchema = Yup.object().shape({
    displayName: Yup.string().required("Display Name is required"),
    name: Yup.string().required("Name is required"),
    phone: Yup.string(),
    openHours: Yup.string(),
    image: Yup.string().required("Image is required"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.logoContainer}>
          <Image source={LOGO} style={styles.logo} resizeMode={"contain"} />
        </View>
        <Pressable style={styles.button} onPress={() => toggleModal()}>
          <Text style={styles.buttonText}>Add farm</Text>
        </Pressable>
      </View>
      <Button text={"Signout"} onPress={() => signOutUser()} />
      <FarmList />

      <Formik
        initialValues={{
          displayName: "",
          name: "",
          phone: "",
          openHours: "",
          image: "",
        }}
        onSubmit={(values, actions) => {
          console.log("Values", values);
          actions.setFieldValue("image", imgUrl);
          addFarmToDB(values);
          actions.resetForm();
        }}
        validationSchema={addFarmSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          resetForm,
        }) => (
          <View>
            <Modal visible={modalVisible}>
              <SafeAreaView style={styles.modal}>
                <View style={styles.modal}>
                  <Text>Modal</Text>
                  <Pressable
                    style={styles.button}
                    onPress={() => (toggleModal(), resetForm())}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Display Name"
                    onChangeText={handleChange("displayName")}
                    onBlur={handleBlur("displayName")}
                    value={values.displayName}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  {errors.displayName && touched.displayName && (
                    <Text style={styles.error}>{errors.displayName}</Text>
                  )}
                  <TextInput
                    style={styles.inputField}
                    placeholder="Name"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  {errors.name && touched.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}
                  <TextInput
                    style={styles.inputField}
                    placeholder="Phone"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Open Hours"
                    onChangeText={handleChange("openHours")}
                    onBlur={handleBlur("openHours")}
                    value={values.openHours}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <Button
                    text={"Add Farm Image"}
                    onPress={() => pickImage(setFieldValue)}
                  />
                  {errors.image && touched.image && (
                    <Text style={styles.error}>{errors.image}</Text>
                  )}
                  <Button text={"Reset Form"} onPress={resetForm} />
                  {/* <Button
                    text={"url"}
                    bordered
                    onPress={() => console.log(imgUrl)}
                  />
                  <Button
                    text={"image"}
                    bordered
                    onPress={() => setFieldValue("image", "imgUrl")}
                  />
                  <Button text={"Values"} onPress={() => console.log(values)} /> */}
                  {/* <Button
                    text={"type of setFieldValue"}
                    onPress={() => console.log(typeof setFieldValue)}
                  /> */}
                  <Button text={"submit"} onPress={handleSubmit} />
                </View>
              </SafeAreaView>
            </Modal>
          </View>
        )}
      </Formik>
    </View>
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
