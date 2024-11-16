import React, { FC, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ImageSourcePropType } from "react-native";
import * as Clipboard from "expo-clipboard";
import AppContext from "./context/AppContext";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import useGenerateReferralCode from "@/hooks/useGenerateReferralCode";
import axios from "axios";

interface User {
  user_id: string;
  wallet_address: string;
  nickname: string;
  profile: string;
  referral_user_id: string;
}

interface ProfileModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  profileImage: ImageSourcePropType;
  setProfileImage: (profileImage: ImageSourcePropType) => void;
  userInfo: User;
  getUserInfo: () => void;
}

const ProfileModal: FC<ProfileModalProps> = ({
  modalVisible,
  setModalVisible,
  profileImage,
  setProfileImage,
  userInfo,
  getUserInfo
}) => {
  const { isConnected, provider, address } = useWalletConnectModal();
  const { url, nickname, setNickname } = useContext(AppContext);
  const navigation =
    useNavigation<NativeStackScreenProps<RootStackParamList>["navigation"]>();
  const [selectedImage, setSelectedImage] =
    useState<ImageSourcePropType | null>(null);
  const [tempNickname, setTempNickname] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);

  const handleDisconnectButtonPress = async () => {
    if (isConnected) {
      try {
        await provider?.disconnect();
        await AsyncStorage.removeItem("walletconnect");
        if (provider) {
          provider.session = undefined;
        }
        setModalVisible(false);
        navigation.dispatch(StackActions.popToTop());
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }
  };

  useEffect(() => {
    if (!address) return;

    const resetSession = async () => {
      if (!isConnected && provider?.session) {
        await AsyncStorage.removeItem("walletconnect");
        provider.session = undefined;
      }
    };
    resetSession();
  }, [address]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  const handleSaveButtonPress = () => {
    if (selectedImage) {
      setProfileImage(selectedImage);
    }
    if (tempNickname) {
      setNickname(tempNickname);
    }

    // 닉네임이 변경된 경우
    const updatedNickname = tempNickname !== userInfo.nickname ? tempNickname : userInfo.nickname;

    // 추천인 코드가 변경된 경우
    const updatedReferralUserId = referralCode !== userInfo.referral_user_id ? referralCode : userInfo.referral_user_id;

    // setUser 호출
    // setUser(updatedNickname, updatedReferralUserId);
    setUser(useGenerateReferralCode(address!) ,updatedNickname,updatedReferralUserId)
    setModalVisible(false);
  };

  const handleModalCloseButtonPress = () => {
    setModalVisible(false);
    setTempNickname(userInfo.nickname);
    setIsCopied(false);
  };

  const handleCopyButtonPress = () => {
    Clipboard.setString(referralCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1100);
  };

  const setUser = async (userId:string, nickname:string, referralUserId:string) => {
    try {
      let response;
      const token = await AsyncStorage.getItem('authToken');

      // 프로필 사진이 있는 경우
      if (selectedImage) {
        // const file = await RNFS.readFile(selectedImage.uri, 'base64'); // base64 인코딩된 데이터 생성
        // const blob = new Blob([Buffer.from(file, 'base64')], { type: 'image/jpeg' });
    
        // // FormData에 Blob 추가
        // const formData = new FormData();
        // formData.append("image", blob, "uploaded_image.jpg");
        // formData.append("nickname", nickname);
        // formData.append("referral_user_id", referralUserId || "");

        // response = await axios.post(`${url}/setUserImage`, formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //     "Authorization": `${token}`
        //   },
        // });
      } else {
        // 프로필 사진이 없는 경우
        console.log("setUser 2222")
        console.log(selectedImage, nickname, referralUserId, userId)
        response = await axios.post(
          `${url}/setUser`,
          { profile: selectedImage ? selectedImage.uri : null , nickname, referral_user_id: referralUserId ? referralUserId : null, user_id:userId },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization":`${token}` 
            },
          }
        );
      }
      
      setFlag(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if(!flag) return;
    getUserInfo();
    setFlag(false);
  }, [flag])
  
  useEffect(() => {
    if(!userInfo) return;
    setTempNickname(userInfo.nickname);
  }, [userInfo])
  

  useEffect(() => {
    if (!userInfo) return;
    console.log("userInfo", userInfo);
  }, [userInfo]);

  return userInfo && (
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
          <View style={styles.topIconsContainer}>
            <Pressable>
              <Feather name="share-2" size={20} color="black" />
            </Pressable>
            <Pressable onPress={handleModalCloseButtonPress}>
              <MaterialIcons name="close" size={24} color="black" />
            </Pressable>
          </View>
          <Pressable onPress={pickImage} style={styles.profileImageContainer}>
            <Image
              source={selectedImage ? selectedImage : profileImage}
              style={styles.profileImage}
            />
            <View style={styles.overlay}>
              <MaterialIcons name="add-a-photo" size={24} color="white" />
            </View>
          </Pressable>
          <Text style={styles.profileAddress}>
            {address?.slice(0, 7)}...{address?.slice(-4)}
          </Text>
          <TextInput
            style={styles.nicknameInput}
            value={tempNickname}
            onChangeText={setTempNickname}
            editable={true}
            textAlign="center"
          />
          <View style={styles.referralContainer}>
            <TextInput
              style={styles.referralInput}
              value={userInfo.user_id}
              editable={false}
              textAlign="center"
            />
            <Pressable
              style={styles.copyButton}
              onPress={handleCopyButtonPress}
            >
              <Feather
                name="copy"
                size={20}
                color={isCopied ? "#3cc455" : "black"}
              />
            </Pressable>
          </View>
          <View style={styles.referralContainer}>
            <TextInput
              style={styles.referralInput}
              placeholder="Referral Code"
              placeholderTextColor="#999"
              editable={true}
              textAlign="center"
              onChangeText={setReferralCode}
            />
            <Pressable style={styles.copyButton}>
              <Feather name="check" size={20} color="black" />
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.disconnectButton}
              onPress={handleDisconnectButtonPress}
            >
              <Text style={styles.actionText}>Disconnect</Text>
            </Pressable>
            <Pressable
              style={styles.saveButton}
              onPress={handleSaveButtonPress}
            >
              <Text style={styles.actionText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContentView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topIconsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    left: 5,
    top: 7,
    borderRadius: 20,
    borderColor: "#fff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 80,
    width: 88,
    height: 88,
  },
  profileAddress: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  nicknameInput: {
    width: 200,
    height: 40,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  referralContainer: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  referralInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  copyButton: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  buttonContainer: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disconnectButton: {
    backgroundColor: "#f97373",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saveButton: {
    backgroundColor: "#737ef9",
    borderRadius: 5,
    paddingHorizontal: 28,
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
});

export default ProfileModal;
