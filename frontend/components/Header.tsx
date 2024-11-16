import React, { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageSourcePropType,
  Switch,
  Pressable,
  Image,
} from "react-native";
import CabinetModal from "./CabinetModal";
import ProfileModal from "./ProfileModal";

interface HeaderProps {
  isSpin: boolean;
  setIsSpin: React.Dispatch<React.SetStateAction<boolean>>;
  seletedIndex: number;
}

const Header: FC<HeaderProps> = ({ isSpin, setIsSpin, seletedIndex }) => {
  const toggleSwitch = () => setIsSpin((previousState) => !previousState);
  const [profileImage, setProfileImage] = useState<ImageSourcePropType>(
    require("../assets/images/logo.png")
  );
  const [profileModalVisible, setProfileModalVisible] =
    useState<boolean>(false);
  const [cabinetModalVisible, setCabinetModalVisible] =
    useState<boolean>(false);

  return (
    <>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.leftContainer}>
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
          </View>
          <Text style={styles.headerText}>Gyrolly</Text>
          <View style={styles.modalContainer}>
            <Pressable onPress={() => setCabinetModalVisible(true)}>
              <Image
                source={require("../assets/images/pack.png")}
                style={styles.cabinet}
              />
            </Pressable>
            <Pressable
              style={[styles.profileContainer]}
              onPress={() => setProfileModalVisible(true)}
            >
              <Image source={profileImage} style={styles.profileImage} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
      <ProfileModal
        modalVisible={profileModalVisible}
        setModalVisible={setProfileModalVisible}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />
      <CabinetModal
        modalVisible={cabinetModalVisible}
        setModalVisible={setCabinetModalVisible}
      />
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
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  leftContainer: {
    flex: 0.3,
    alignItems: "flex-start",
  },
  headerText: {
    marginLeft: "7%",
    fontSize: 28,
    fontFamily: "gamhong",
    fontWeight: "900",
    fontStyle: "italic",
  },
  modalContainer: {
    flexDirection: "row",
    gap: 4,
  },
  toggleContainer: {
    zIndex: 1,
  },
  profileContainer: {
    zIndex: 1,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  cabinet: {
    width: 35,
    height: 35,
  },
});

export default Header;
