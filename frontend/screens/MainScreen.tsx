import React, { useState, useEffect } from "react";

import { StyleSheet, Text, View } from "react-native";
import { Ball } from "components/Ball";

const MainScreen = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <View>
      <Text>
        MainScreen
        <Ball isSpin={false} setCount={setCount} spinCount={0} />
      </Text>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
