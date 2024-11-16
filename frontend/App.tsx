import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import AppContext from "./components/context/AppContext";
import { Dimensions, StatusBar } from "react-native";
import LoginScreen from "./screens/LoginScreen";

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
    url: "http://192.168.1.50:5003",
  };

  return (
    <AppContext.Provider value={values}>
      <StatusBar barStyle={"dark-content"} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginScreen
                {...props}
                setIsLoggedIn={() => {
                  setIsLoggedIn(true);
                }}
              />
            )}
          </Stack.Screen>
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
