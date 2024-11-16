import React, { useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import HomeScreen from "./HomeScreen";
import NFTScreen from "./NFTScreen";
import RankingScreen from "./RankingScreen";
import Header from "../components/Header";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MainScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSpin, setIsSpin] = useState<boolean>(false);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <HomeScreen isSpin={isSpin} />;
      case 1:
        return <NFTScreen />;
      case 2:
        return <RankingScreen />;
      default:
        return <HomeScreen isSpin={isSpin} />;
    }
  };

  return (
    <GestureHandlerRootView style={styles.screen}>
      <Header
        isSpin={isSpin}
        setIsSpin={setIsSpin}
        seletedIndex={selectedIndex}
      />
      <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: "grey",
    backgroundColor: "black",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "grey",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
