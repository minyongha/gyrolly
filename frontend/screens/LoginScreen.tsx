import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageSourcePropType,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import WalletConnect from "@walletconnect/client";
import { ethers } from "ethers";
import axios from "axios";
import { signMessage } from "../hooks/signMessage";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import useGenerateNickname from "../hooks/useGenerateNickname";
import AppContext from "../components/context/AppContext";
import useGenerateReferralCode from "../hooks/useGenerateReferralCode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const projectId = "b0abb773eb9bb357ded7c9e115f724d9";

const providerMetadata = {
  name: "App",
  description: "App",
  url: "https://your-project-website.com/",
  icons: ["https://your-project-logo.com/"],
  redirect: {
    native: "exp://10.0.0.126:8081",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login"> & {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const logo = require("../assets/images/logo.png");

const LoginScreen: React.FC<LoginScreenProps> = ({
  setIsLoggedIn,
  navigation,
}) => {
  const { open, isConnected, provider, address } = useWalletConnectModal();
  const { setNickname, nickname, url } = useContext(AppContext);
  const web3Provider = useMemo(
    () => (provider ? new ethers.providers.JsonRpcProvider("https://testnet.evm.nodes.onflow.org") : undefined),
    [provider]
  );

  useEffect(() => {
    if (isConnected && provider) {
      if (!address) return;
      const referCode = useGenerateReferralCode(address);

      login(referCode);

      setIsLoggedIn(true);
      navigation.navigate("Main");
    }
  }, [isConnected, provider]);

  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    setNickname(useGenerateNickname());
    return open();
  };

  useEffect(() => {
    if (nickname.length === 0) return;
  }, [nickname]);

  const login = async (referCode: string) => {
    try {
      console.log("REFER", referCode);
      const response = await axios.post(
        `${url}/getUser`,
        { user_id: referCode },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("CHECK", response.data.data.results[0]);
      const isSignUp =
        response.data.data.results[0].length === 1 ? true : false;
      console.log("IS", isSignUp);
      //없으면 회원가입
      if (!isSignUp) {
        const resTimestamp = await axios.get(`${url}/getTimeStamp`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(
          "RESTIMESTAMP",
          resTimestamp.data.data.results[0][0].timestamp
        );

        const messageToSend = resTimestamp.data.data.results[0][0].timestamp;
        const res = await signMessage({
          web3Provider: web3Provider!,
          method: "personal_sign",
          message: messageToSend.toString(),
        });

        console.log("RES", res.result);

        const resSignup = await axios.post(
          `${url}/signUp`,
          { walletAddress: address, nickname: nickname },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("SIGNUP", resSignup.data);

        const resAuthToken = await axios.post(
          `${url}/getAuthToken`,
          { timestamp: messageToSend, signature: res.result, address: address },
          { headers: { "Content-Type": "application/json" } }
        );
        saveToken(resAuthToken.data.data.result[0][0].token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      console.log("token save");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Gyrolly</Text>
        <Image source={logo} style={styles.image} />
        <Pressable onPress={handleButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </Pressable>
        <WalletConnectModal
          explorerRecommendedWalletIds={[
            "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          ]}
          explorerExcludedWalletIds={"ALL"}
          projectId={projectId}
          providerMetadata={providerMetadata}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Lato",
  },
  title: {
    fontSize: 60,
    fontWeight: "900",
    marginBottom: -130,
    zIndex:1,
    fontFamily: "문경 감흥사과",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#FF972F",
    paddingVertical: 12,
    paddingHorizontal: 70,
    marginTop: 10,
    borderRadius: 8,
  },
  image: {
    // flex: 1,
    resizeMode: "contain",
    width: "80%",
    height: 500,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default LoginScreen;
