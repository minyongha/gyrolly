import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { rankingData } from "../constants";
import axios from "axios";
import AppContext from "@/components/context/AppContext";

interface RankingScreenProps {
  referralCode: string;
  totalPoint: number;
}

interface LeaderBoard {
  num: number;
  user_id: string;
  wallet_address: string;
  nickname: string;
  profile_image: string;
  referral_user_id: string;
  total_point: number;
}

const RankingScreen: React.FC<RankingScreenProps> = ({ referralCode }) => {
  const { url } = useContext(AppContext);
  const [rank, setRank] = useState<number>(0);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard[]>([]);

  const getRank = async () => {
    try {
      const response = await axios.post(
        `${url}/getRank`,
        { user_id: referralCode },
        { headers: { "Content-Type": "application/json" } }
      );
      setRank(response.data.data.results[0][0].my_rank);
    } catch (error) {
      console.error(error);
    }
  };

  const getLeaderboard = async () => {
    try {
      const response = await axios.post(
        `${url}/getLeaderboard`,
        { from: 1, to: 100 },
        { headers: { "Content-Type": "application/json" } }
      );
      setLeaderBoard(response.data.data.results[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (referralCode.length === 0) return;
    getRank();
    getLeaderboard();
  }, [referralCode]);

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
export default RankingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    fontFamily: "Lato",
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
