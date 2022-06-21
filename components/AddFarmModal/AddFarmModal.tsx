import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import React from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { storage, db } from "../../config/firebase";

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

const AddFarmModal = ({ toggleModal, modalVisible }: AddFarmModalProps) => {
  const [imageLoading, setImageLoading] = React.useState(false);

  const addFarmToDB = async (values: MyFormValues) => {
    const docRef = await addDoc(collection(db, "Farms"), values);
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
    });

    if (!result.cancelled) {
      setImageLoading(true);
      const imgName = result.uri.split("/").pop();
      const imagesRef = ref(storage, `images/${imgName}`);
      const img = await fetch(result.uri);
      /**
       * look into expo imagepickers base 64 encoding as possbile substitute for blob
       */
      const blob = await img.blob();
      await uploadBytes(imagesRef, blob);
      const url = await getDownloadURL(imagesRef);
      setFieldValue("image", url);

      setImageLoading(false);
    }
  };

  const addFarmSchema = Yup.object().shape({
    displayName: Yup.string().required("Display Name is required"),
    name: Yup.string()
      .required("Name is required")
      .test("Unique", "Name is taken", async (value) => {
        const querySnapshot = await getDocs(collection(db, "Farms"));
        const farmNames = querySnapshot.docs.map((doc) =>
          doc.data().name.toLowerCase()
        );
        return !farmNames.includes(value?.toLocaleLowerCase());
      }),
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
                  placeholder="Farm Name"
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
                  />
                  {errors.image && touched.image && (
                    <Text style={styles.error}>{errors.image}</Text>
                  )}
                  {imageLoading && (
                    <ActivityIndicator
                      style={styles.child}
                      size="small"
                      color="#fff"
                    />
                  )}
                  {values.image !== "" && (
                    <Image
                      style={styles.itemPhoto}
                      source={{ uri: values.image }}
                      resizeMode="cover"
                    />
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
  },
  modal: {
    padding: 20,
  },
  child: {
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
  itemPhoto: {
    width: 120,
    height: 120,

    alignSelf: "center",
    marginTop: 20,
  },
});
