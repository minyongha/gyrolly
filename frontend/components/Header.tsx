import React, { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageSourcePropType,
  Switch,
} from "react-native";

interface HeaderProps {
  isSpin: boolean;
  setIsSpin: React.Dispatch<React.SetStateAction<boolean>>;
  seletedIndex: number;
}

const Header: FC<HeaderProps> = ({ isSpin, setIsSpin, seletedIndex }) => {
  const toggleSwitch = () => setIsSpin((previousState) => !previousState);
  const [profileImage] = useState<ImageSourcePropType>(
    require("../assets/images/1.webp")
  );

  return (
    <>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          {seletedIndex == 0 && (
            <View style={styles.toggleContainer}>
              <Switch
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isSpin ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isSpin}
              />
            </View>
          )}
          <Text style={styles.headerText}>Gyrolly</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 12,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "900",
    fontStyle: "italic",
    textAlign: "center",
  },
  toggleContainer: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  },
  cabinetContainer: {
    position: "absolute",
    top: 3,
    right: 58,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  profileContainer: {
    position: "absolute",
    right: 16,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
});

export default Header;
