import React, {
  useContext,
  createContext,
  Suspense,
  useRef,
  FC,
  useState,
  useEffect,
} from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import { useGLTF } from "@react-three/drei";

import { Canvas, useFrame } from "@react-three/fiber";
import { Asset } from "expo-asset";
import * as THREE from "three";
import AppContext from "./context/AppContext";

const soccerBallModel = require("../assets/gltfs/soccer_ball.glb");
const basketBallModel = require("../assets/gltfs/basketball.glb");

const models: { [key: string]: any } = {
  soccerball: soccerBallModel,
  basketball: basketBallModel,
};

function Model(props: any) {
  const { selectedBall } = useContext(AppContext);

  const gltfAsset = Asset.fromModule(models[selectedBall]).uri;
  const { nodes, materials } = useGLTF(gltfAsset) as any;

  const nodeMaterialMap: Record<
    string,
    { node: any; material: any; scale: number }[]
  > = {
    soccerball: [
      {
        node: nodes.Icosphere_Material001_0,
        material: materials["Material.001"],
        scale: 0.02,
      },
      {
        node: nodes.Icosphere_Material002_0,
        material: materials["Material.002"],
        scale: 0.02,
      },
    ],
    basketball: [
      {
        node: nodes.Basketball_0,
        material: materials["Material"],
        scale: 0.019,
      },
      {
        node: nodes.Basketball_1,
        material: materials["Material.001"],
        scale: 0.019,
      },
    ],
  };

  return (
    <group {...props} dispose={null}>
      <group rotation={[0, 0, 0]} scale={200}>
        {nodeMaterialMap.soccerball?.map((item, index) =>
          item.node && item.material ? (
            <mesh
              key={index}
              geometry={item.node.geometry}
              material={item.material}
              scale={[item.scale, item.scale, item.scale]}
            />
          ) : null
        )}
      </group>
    </group>
  );
}
function ControlModel({
  rotationVelocity,
}: {
  rotationVelocity: { x: number; y: number };
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(
        new THREE.Euler(rotationVelocity.x, rotationVelocity.y, 0, "XYZ")
      );
      groupRef.current.quaternion.multiplyQuaternions(
        quaternion,
        groupRef.current.quaternion
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Model position={[0, 0, 0]} scale={0.8} />
    </group>
  );
}

interface BallProps {
  isSpin: boolean;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  spinCount: number;
}

export const Ball: FC<BallProps> = ({ isSpin, setCount, spinCount }) => {
  const [rotationVelocity, setRotationVelocity] = useState({ x: 0, y: 0 });
  const slid = useRef(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (!isSpin) {
        setRotationVelocity({
          x: gestureState.dy * 0.01,
          y: gestureState.dx * 0.01,
        });
        if (!slid.current) {
          setCount((prev) => prev + 1);
          slid.current = true;
        }
      }
    },
    onPanResponderRelease: () => {
      setRotationVelocity((prev) => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95,
      }));
      slid.current = false;
    },
  });

  useEffect(() => {
    if (isSpin) {
      setRotationVelocity({ x: 0.2, y: 0 });
    }
  }, [spinCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationVelocity((velocity) => ({
        x: velocity.x * 0.95,
        y: velocity.y * 0.95,
      }));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.ballContainer} {...panResponder.panHandlers}>
      <Text>IM ZBssALL</Text>
      <Canvas style={{ width: 480 }}>
        <ambientLight intensity={2.0} />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <ControlModel rotationVelocity={rotationVelocity} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  ballContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
});
