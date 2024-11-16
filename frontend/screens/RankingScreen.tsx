import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { rankingData } from "../constants";

export default function RankingScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          {rankingData.slice(0, 3).map((rank, index) => (
            <View key={index} style={styles.topProfile}>
              <Image
                source={rank.image}
                style={
                  index === 1
                    ? styles.profileImageFirst
                    : styles.profileImageSecondThird
                }
              />
              <Text style={styles.nickname}>{rank.name}</Text>
              <Text style={styles.score}>{rank.score}</Text>
            </View>
          ))}
        </View>
        <ScrollView style={styles.rankContainer}>
          {rankingData.slice(3).map((rank, index) => (
            <View key={index} style={styles.rankItem}>
              <Text style={styles.rankItemText}>{rank.rank}</Text>
              <Image style={styles.rankItemImage} source={rank.image} />
              <Text style={styles.rankItemText}>{rank.name}</Text>
              <Text style={styles.rankItemText}>{rank.score}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: "13%",
  },
  topSection: {
    flexDirection: "row",
    gap: 8,
  },
  topProfile: {
    alignItems: "center",
    gap: 6,
  },
  profileImageFirst: {
    width: 110,
    height: 110,
    borderRadius: 70,
  },
  profileImageSecondThird: {
    width: 80,
    height: 80,
    borderRadius: 70,
    marginTop: 50,
  },
  nickname: {
    fontSize: 16,
    fontWeight: "bold",
  },
  score: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rankContainer: {
    marginTop: "5%",
    width: "95%",
    height: "10%",
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#d6d6d6",
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    width: "100%",
    height: 80,
  },
  rankItemText: {
    fontWeight: "bold",
    fontSize: 22,
  },
  rankItemImage: {
    width: 50,
    height: 50,
    borderRadius: 70,
  },
});
