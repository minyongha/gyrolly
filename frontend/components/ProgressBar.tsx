import React, { useRef, useEffect, FC } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

interface ProgressBarProps {
    isSpin: boolean;
    value: number;
    maxValue: number;
}

const ProgressBar:FC<ProgressBarProps> = ({ value, maxValue, isSpin }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (value / maxValue) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [value, maxValue, progress]);

  const progressInterpolate = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, !isSpin ? { width: progressInterpolate } : { width: progressInterpolate, backgroundColor: '#FFFFFF'}]} />
      </View>
      
      <Animated.View style={[styles.iconContainer, { left: progressInterpolate }]}>
      <Image
          source={require("../assets/images/logo.png")}
          style={styles.icon}
        />
        <View style={styles.markerContainer}>
            <View style={styles.markerTriangle} />
            <Text style={styles.markerText}>{value && value.toLocaleString()}</Text>
        </View>
      </Animated.View>

     
      {/* Max Value Label */}
      <Text style={styles.maxValueText}>{maxValue && maxValue.toLocaleString()}</Text>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 5,
  },
  markerContainer: {
    position: 'absolute',
    top:40,
    marginLeft: -15,
    alignItems: 'center',
  },
  markerText: {
    fontSize: 12,
    color: '#000',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    marginTop: 2,
  },
  iconContainer: {
    position: 'absolute',
    top: -30,
    width: 30,
    height: 30,
  },
  icon: {
    width: '100%',
    height: '100%',
    marginLeft: -15,
    resizeMode: 'contain',
  },
  maxValueText: {
    fontSize: 12,
    color: '#000',
    position: 'absolute',
    right: -10,
    top: 15,
  },
});