import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationRouter } from "./navigation/NavigationRouter";
import "./config/firebase";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationRouter />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
