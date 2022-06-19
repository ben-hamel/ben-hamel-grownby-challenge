import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { auth } from "../../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../../navigation/AuthStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Values {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const LoginFormSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const signInUser = (formikValues: Values) => {
    signInWithEmailAndPassword(auth, formikValues.email, formikValues.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log("Signed In");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Signed In Error");
        console.log("error code" + errorCode);
        console.log("error message" + errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
          signInUser(values);
        }}
        validationSchema={LoginFormSchema}
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
            {/* <Button title="Submit" onPress={handleSubmit as any} /> */}
            <Pressable style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      {/* <Button title="Register" onPress={() => navigation.navigate("SignUp")} /> */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
  },
  inputField: {
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
