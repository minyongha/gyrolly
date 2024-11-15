import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import { nftData } from "../constants";

const NFTScreen = () => {
  return (
    <View style={styles.nftContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.title}>Total NFT Points</Text>
        <View style={styles.pointContent}>
          <Text style={styles.point}>24,342</Text>
        </View>
      </View>
      <ScrollView style={styles.ballContainer}>
        {nftData.map((item, index) => (
          <View key={index} style={styles.ballContent}>
            <View style={styles.ball}>
              <Image source={item.image} style={styles.ballImage} />
            </View>
            <View style={styles.ballInfo}>
              <Text style={styles.ballName}>{item.name}</Text>
              <Text>point: {item.point.toLocaleString()}</Text>
              {item.isLocked ? (
                <View style={styles.buyNowButton}>
                  <Text style={styles.buyNowText}>Buy Now</Text>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NFTScreen;

const styles = StyleSheet.create({
  nftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pointContainer: {
    width: "80%",
    marginTop: 50,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  pointContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  point: {
    fontSize: 40,
    fontWeight: "bold",
  },
  ballContainer: {},
  ballContent: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  ball: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  ballImage: {
    width: 80,
    height: 80,
  },
  ballInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    width: 150,
  },
  ballName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buyNowButton: {
    backgroundColor: "#ff9730",
    padding: 3,
    borderRadius: 7,
    width: 100,
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
  buyNowText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
});
