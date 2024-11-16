import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RankingScreen from "./screens/RankingScreen";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import HomeScreen from "@/screens/HomeScreen";

import BottomNavigation from "./components/BottomNavigation";
import AppContext from "./components/context/AppContext";

const Stack = createStackNavigator();

export default function App() {
  const [nickname, setNickname] = useState<string>("");

  const [selectedBall, setSelectedBall] = useState<string>("soccerball");

  const values = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    nickname,
    setNickname,
    selectedBall,
    setSelectedBall,
  };

  return (
    <AppContext.Provider value={values}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen isSpin={true} />}
          </Stack.Screen>
          <Stack.Screen name="Ranking">
            {(props) => <RankingScreen />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <View style={styles.container}>
        {/* <Text>Open up App.tsx to start working on your app!</Text> */}
        <StatusBar style="auto" />
      </View>
    </AppContext.Provider>
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
