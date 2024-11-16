import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BarChart } from "react-native-gifted-charts";

const CustomBottomSheet = () => {
  const [handleColor, setHandleColor] = useState("#ffffff");
  const [totalPoints, setTotalPoints] = useState(0);

  const handleSheetChanges = useCallback((index: number) => {
    setHandleColor(index === 0 ? "#ffffff" : "#e9e9e9");
  }, []);

  const renderHandle = () => (
    <View style={[styles.handle, { backgroundColor: handleColor }]}>
      <View style={styles.handleIndicator} />
    </View>
  );

  const getWeekdayLabels = (numberOfDays: number) => {
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const today = new Date().getDay();
    return Array.from(
      { length: numberOfDays },
      (_, i) => daysOfWeek[(today - i + 7) % 7]
    ).reverse();
  };

  const values = [
    250, 500, 745, 320, 600, 256, 300, 450, 670, 800, 390, 420, 520,
  ];

  const barData = getWeekdayLabels(values.length).map((label, index) => ({
    value: values[index],
    label,
  }));

  const assignFrontColorAndStar = (data: any) => {
    const maxValue = Math.max(...data.map((item: any) => item.value));
    return data.map((item: any) => {
      if (item.value === maxValue) {
        return {
          ...item,
          frontColor: "#FFA500",
        };
      }
      return item;
    });
  };

  return (
    <BottomSheet
      snapPoints={["20%", "58%"]}
      onChange={handleSheetChanges}
      handleComponent={renderHandle}
      maxDynamicContentSize={77}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.totalPointsSection}>
          <Text style={styles.totalPointsText}>Total Points</Text>
          <Text style={styles.totalPoints}>{totalPoints}</Text>
        </View>
        <View style={styles.chartSection}>
          <View style={styles.chart}>
            <BarChart
              barWidth={27}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              data={assignFrontColorAndStar(barData)}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={25}
              adjustToWidth={true}
              width={300}
              scrollToEnd
              initialSpacing={-6}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handle: {
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: -15,
  },
  handleIndicator: {
    width: 40,
    height: 3,
    backgroundColor: "#79747e",
    borderRadius: 3,
    alignSelf: "center",
  },
  contentContainer: {
    flex: 1,
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    // justifyContent: "center",
    backgroundColor: "#e9e9e9",
  },
  totalPointsSection: {
    marginTop: 5,
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  totalPointsText: {
    position: "absolute",
    top: 10,
    left: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  totalPoints: {
    fontSize: 40,
    fontWeight: "900",
  },
  chartSection: {
    backgroundColor: "white",
    padding: 10,
    width: "90%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  chart: {
    marginTop: 30,
  },
});

export default CustomBottomSheet;
