import React, { FC, useContext, useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AppContext from "./context/AppContext";
import { cabinetData } from "@/constants";

interface CabinetModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const CabinetModal: FC<CabinetModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const { setSelectedBall } = useContext(AppContext);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleSelectedBall = (model: string, index: number) => {
    setSelectedBall(model);
    setModalVisible(false);
    setSelectedIndex(index);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContentView}>
        <View style={styles.modalView}>
          <View style={styles.topContainer}>
            <Text style={styles.modalTitle}>Cabinet</Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {cabinetData.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.gridItem,
                  selectedIndex === index && styles.selectedItem,
                ]}
                onPress={() => handleSelectedBall(item.model, index)}
                disabled={item.isLocked}
              >
                <Image source={item.image} style={styles.gridImage} />
                {item.isLocked && (
                  <>
                    <View style={styles.absoluteOverlay} />
                    <FontAwesome
                      name="lock"
                      size={35}
                      color="black"
                      style={styles.lockIcon}
                    />
                  </>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  gridItem: {
    width: "47%",
    aspectRatio: 1,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  selectedItem: {
    borderColor: "orange",
    borderWidth: 2,
  },
  absoluteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#b2b2b2",
    opacity: 0.6,
    borderRadius: 15,
  },
  gridImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  modalContentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    height: 550,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  topContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 170,
  },
  lockIcon: {
    position: "absolute",
    alignSelf: "center",
    top: "35%",
  },
});

export default CabinetModal;
