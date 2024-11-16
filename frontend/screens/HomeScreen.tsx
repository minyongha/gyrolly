import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ball } from "../components/Ball";

interface HomeScreenProps {
  isSpin: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ isSpin }) => {
  const [spinCount, setSpinCount] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.45.160:8080");
    console.log("ws: ", ws);

    ws.onmessage = (event) => {
      console.log("count: ", event.data);
      setSpinCount(event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

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

      <Ball isSpin={isSpin} setCount={setCount} spinCount={spinCount} />
      <View style={styles.progressContainer}></View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
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
