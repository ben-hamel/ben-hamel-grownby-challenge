import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import React from "react";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../../config/firebase";
// import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import PrimaryButton from "../PrimaryButton";
import * as ImagePicker from "expo-image-picker";

interface MyFormValues {
  displayName: string;
  name: string;
  phone: string;
  openHours: string;
  image: string;
}

interface AddFarmModalProps {
  modalVisible: boolean;
  toggleModal: () => void;
}

// const reload = () => window.location.reload();

const AddFarmModal = ({ toggleModal, modalVisible }: AddFarmModalProps) => {
  const addFarmToDB = async (values: MyFormValues) => {
    const docRef = await addDoc(collection(db, "Farms"), values);
    toggleModal();
    // reload();
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

    if (!result.cancelled) {
      const imgName = result.uri.split("/").pop();
      const imagesRef = ref(storage, `images/${imgName}`);
      const img = await fetch(result.uri);
      const blob = await img.blob();
      await uploadBytes(imagesRef, blob);
      const url = await getDownloadURL(imagesRef);
      setFieldValue("image", url);
    }
  };

  // const pickImage = async (
  //   setFieldValue: (
  //     field: string,
  //     value: any,
  //     shouldValidate?: boolean | undefined
  //   ) => void
  // ) => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log("result", result);

  //   if (!result.cancelled) {
  //     // const storageRef = ref(storage, "image.jpg");

  //     const img = await fetch(result.uri);
  //     const blob = await img.blob();
  //     const uploadTask = uploadBytesResumable(storageRef, blob);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log("Upload is " + progress + "% done");
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //         }
  //       },
  //       (error) => {
  //         console.log("error", error);
  //       },
  //       () => {
  //         console.log("Upload completed");
  //         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //           console.log("url", url);
  //           // setImgUrl(url);
  //           setFieldValue("image", url);
  //         });
  //       }
  //     );
  //   }
  // };

  const addFarmSchema = Yup.object().shape({
    displayName: Yup.string().required("Display Name is required"),
    name: Yup.string().required("Name is required"),
    phone: Yup.string(),
    openHours: Yup.string(),
    image: Yup.string().required("Image is required"),
  });

  return (
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
        // actions.setFieldValue("image", imgUrl);
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
        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={styles.modal}>
                <PrimaryButton
                  text="Cancel"
                  onPress={() => (toggleModal(), resetForm())}
                />
                <TextInput
                  style={[styles.inputField, styles.child]}
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
                  style={[styles.inputField, styles.child]}
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
                  style={[styles.inputField, styles.child]}
                  placeholder="Optional: Phone"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  autoCapitalize="none"
                  autoCorrect={false}
                  // keyboardType="email-address"
                  keyboardType="numeric"
                  textContentType="emailAddress"
                />
                <TextInput
                  style={[styles.inputField, styles.child]}
                  placeholder="Optional: Open Hours"
                  onChangeText={handleChange("openHours")}
                  onBlur={handleBlur("openHours")}
                  value={values.openHours}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
                <View style={styles.child}>
                  <PrimaryButton
                    text={"Add Farm Image"}
                    onPress={() => pickImage(setFieldValue)}
                    // style={styles.child}
                  />
                  {errors.image && touched.image && (
                    <Text style={styles.error}>{errors.image}</Text>
                  )}
                </View>
                <View style={styles.child}>
                  <PrimaryButton text={"Reset Form"} onPress={resetForm} />
                </View>
                <View style={styles.child}>
                  <PrimaryButton text={"submit"} onPress={handleSubmit} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </Modal>
      )}
    </Formik>
  );
};

export default AddFarmModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f5d40",
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
    // marginHorizontal: 20,
    // padding: 20,
  },
  modal: {
    // backgroundColor: "blue",
    padding: 20,
    // justifyContent: "space-between",
    // flex: 1,
    // alignItems: "center",
    // borderRadius: 10,
    // marginHorizontal: 20,
    // alignItems: "center",
    // justifyContent: "center",
  },
  child: {
    // backgroundColor: "red",
    marginTop: 20,
  },
  inputField: {
    backgroundColor: "white",
    padding: 12,

    borderWidth: 1,
    borderRadius: 5,
  },
  error: { color: "red" },
  button: {
    backgroundColor: "#6dbe4b",
    paddingVertical: 10,
    borderRadius: 6,
    padding: 10,
  },
  buttonText: { color: "white", fontSize: 16 },
});
