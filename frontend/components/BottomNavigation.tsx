import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const navItems = [
  { name: "home-outline", label: "Home", index: 0 },
  { name: "cards-outline", label: "NFT", index: 1 },
  { name: "star-outline", label: "Ranking", index: 2 },
];

const BottomNavigation = () => {
  return (
    <View style={styles.bottomNavigationContainer}>
      {navItems.map((item) => (
        <TouchableOpacity key={item.index} style={styles.navItem}>
          <Icon name={item.name} size={24} color={"#000"} />
          <Text style={styles.navLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  bottomNavigationContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: "gray",
    backgroundColor: "white",
  },
  navItem: {
    width: 100,
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "gray",
  },
});
