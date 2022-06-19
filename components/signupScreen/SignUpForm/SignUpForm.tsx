import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../../config/firebase";
import { auth } from "../../../config/firebase";
import { setDoc, doc } from "firebase/firestore";

interface Values {
  email: string;
  password: string;
}

const SignUpForm = () => {
  const navigation = useNavigation();

  const SignUpFormSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const registerUser = async (formikValues: Values) => {
    try {
      const authUser = await createUserWithEmailAndPassword(
        auth,
        formikValues.email,
        formikValues.password
      );
      const docRef = await setDoc(doc(db, "users", authUser.user.uid), {
        owner_uid: authUser.user.uid,
        email: authUser.user.email,
      });
      console.log("Signed Up");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
          //   signInUser(values);
          registerUser(values);
        }}
        validationSchema={SignUpFormSchema}
      >
        {(
          // props
          { handleChange, handleBlur, handleSubmit, values, errors, touched }
        ) => (
          <View>
            {/* <Text>Email</Text> */}
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            {/* <Text>Password</Text> */}
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            {/* <TextInput
              style={styles.inputField}
              placeholder="Confirm Password"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )} */}

            <Pressable style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      {/* <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable> */}
    </View>
  );
};

export default SignUpForm;
const styles = StyleSheet.create({
  container: {
    marginTop: 80,
  },
  inputField: {
    // flex: 1,
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  error: { color: "red" },
  button: {
    width: "100%",
    marginTop: 24,
    backgroundColor: "#3f2b56",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "white", fontSize: 16 },
});
