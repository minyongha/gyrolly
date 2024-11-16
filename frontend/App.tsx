import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RankingScreen from "./screens/RankingScreen";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <RankingScreen />
        {/* <Text>Open up App.tsx to start working on your app!</Text> */}
        <StatusBar style="auto" />
      </View>
    </AppProvider>
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
