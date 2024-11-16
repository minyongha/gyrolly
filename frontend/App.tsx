import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import AppContext from "./components/context/AppContext";
import { Dimensions, StatusBar } from "react-native";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Ranking: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      <StatusBar barStyle={"dark-content"} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
