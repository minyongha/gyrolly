import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, Image, StyleSheet, AppState } from "react-native";
import { Ball } from "../components/Ball";
import AppContext from "@/components/context/AppContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressBar from "@/components/ProgressBar";

interface HomeScreenProps {
  isSpin: boolean;
  referralCode: string;
  totalPoint: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ isSpin, referralCode }) => {
  const {url} = useContext(AppContext);
  const [dbSpin, setDbSpin] = useState<number>(0);
  const [dbSlide, setDbSlide] = useState<number>(0);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [maxSpinCount, setMaxSpinCount] = useState<number>(0);
  const [maxCount, setMaxCount] = useState<number>(0);
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef(count);

  const getTodayMaxCount = async() => {
    try{
      const response = await axios.get(`${url}/getTodayMaxCount`,{headers:{"Content-Type":"application/json"}});

      setMaxCount(response.data.data.results[0][0].slide_max_count);
      setMaxSpinCount(response.data.data.results[0][0].spin_max_count);
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    const ws = new WebSocket("ws://10.24.60.53:8083");
    console.log("ws: ", ws);

    ws.onmessage = (event) => {
      console.log("count: ", event.data);
      setSpinCount(event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  const getTodayCount = async () => {
    try{
      console.log("REFER",referralCode)
      const response = await axios.post(`${url}/getTodayCount`, { user_id: referralCode }, {headers:{'Content-Type':'application/json'}});
      if(response.data.result === 1){
        console.log("CHECK",response.data.data.results[0]);
        if(response.data.data.results[0].length === 0) return;
        setSpinCount(response.data.data.results[0][0].spin_count);
        setCount(response.data.data.results[0][0].slide_count);
        setDbSlide(response.data.data.results[0][0].slide_count);
        setDbSpin(response.data.data.results[0][0].spin_count);
      }
    }catch(error){
      console.error(error);
    }
  }

  const sendCount = async (count:number) => {
    try{
      const token = await AsyncStorage.getItem('authToken');
      console.log("SENDCount",referralCode);
      const response = await axios.post(`${url}/addCount`,{spin_count: spinCount - dbSpin, slide_count: count - dbSlide},{headers: {"Content-Type":"application/json", "Authorization":`${token}` }});
      console.log("SEND", response.data);

    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState:string) => {
  //     if (appState.current.match(/active/) && nextAppState === 'background') {
  //       console.log("COUNTREF",countRef.current,dbSlide);
  //       sendCount(countRef.current - dbSlide); // 백그라운드로 전환 시 실행
  //     }
  //     appState.current = nextAppState as AppStateStatus;
  //   };

  //   const subscription = AppState.addEventListener("change", handleAppStateChange);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    if(referralCode.length === 0) return;
    getTodayCount();
    getTodayMaxCount();
  }, [referralCode]);

  return (
    <View
      style={[styles.mainContent, isSpin && { backgroundColor: "#FFA500" }]}
    >
      <View
        style={[styles.speechBubble, isSpin && { backgroundColor: "#FFFFFF" }]}
      >
        <Text style={[styles.text, isSpin && { color: "#FFA500" }]}>
          {isSpin ? spinCount : count}
        </Text>
        <View
          style={[styles.bubbleTail, isSpin && { borderTopColor: "#FFFFFF" }]}
        />
      </View>
      <Ball isSpin={isSpin} setCount={setCount} spinCount={spinCount} count={count} sendCount={sendCount}/>
      <View style={styles.progressContainer}>
        {isSpin ? (
          <ProgressBar value={spinCount} maxValue={maxSpinCount} isSpin={isSpin} />
        ) : (
          <ProgressBar value={count} maxValue={maxCount} isSpin={isSpin} />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    fontFamily: "Lato",
    alignItems: "center",
    justifyContent: "center",
  },
  speechBubble: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    position: "absolute",
    alignSelf: "flex-end",
    marginRight: "12%",
    marginBottom: 15,
    top: 70,
    right: 40,
  },
  bubbleTail: {
    position: "absolute",
    width: 0,
    height: 0,
    bottom: -15,
    left: 10,
    borderLeftWidth: 0,
    borderRightWidth: 20,
    borderTopWidth: 20,
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFA500",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  contents: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "75%",
    resizeMode: "contain",
  },
  characterImage: {
    width: "18%",
    marginBottom: -7,
    resizeMode: "contain",
    position: "relative",
  },
  progressContainer: {
    marginTop: 36,
    width: "80%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 12,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  progressText: {
    fontSize: 14,
    color: "grey",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
