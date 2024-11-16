import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import HomeScreen from "./HomeScreen";
import NFTScreen from "./NFTScreen";
import RankingScreen from "./RankingScreen";
import Header from "../components/Header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useGenerateReferralCode from "@/hooks/useGenerateReferralCode";
import axios from "axios";
import AppContext from "@/components/context/AppContext";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";

interface DailyPoint{
  date: string;
  spin_count: number;
  slide_count: number;
  nft_point: number;    
  referral_point: number;
}

export default function MainScreen() {
  const { url } = useContext(AppContext);
  const { address } = useWalletConnectModal();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSpin, setIsSpin] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [dailyPoints, setDailyPoints] = useState<DailyPoint[]>([]);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <HomeScreen isSpin={isSpin} referralCode={referralCode} totalPoint={totalPoint} />;
      case 1:
        return <NFTScreen />;
      case 2:
        return <RankingScreen totalPoint={totalPoint} referralCode={referralCode}/>;
      default:
        return <HomeScreen isSpin={isSpin} referralCode={referralCode} totalPoint={totalPoint} />;
    }
  };

  const getTotalPoint = async () => {
    try{
      const response = await axios.post(`${url}/getTotalCount`, {userId: referralCode}, {headers:{'Content-Type':'application/json'}});
      if(response.data.data.results[0].length === 0) return;
      setTotalPoint(response.data.data.results[0][0].total_point);
    }catch(error){
      console.error(error);
    }
  }

  const getDailyPoint = async() =>{
    try{
      const response = await axios.post(`${url}/getDailyCount`, {userId: referralCode}, {headers: {"Content-Type":'applitcation/json'}})
      setDailyPoints(response.data.data.results[0]);
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    if (!address) return;

    setReferralCode(useGenerateReferralCode(address));
  }, [address]);

  useEffect(() => {
    if(referralCode.length === 0) return;
    getTotalPoint();
    getDailyPoint();
  }, [referralCode])  


  return (
    <GestureHandlerRootView style={styles.screen}>
      <Header
        isSpin={isSpin}
        setIsSpin={setIsSpin}
        seletedIndex={selectedIndex}
        referralCode={referralCode}
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
