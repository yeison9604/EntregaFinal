import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type LogoAseoProps = {
  style?: StyleProp<ImageStyle>;
};

const LogoAseo = ({ style }: LogoAseoProps) => {
  return (
    <Image
      source={require("../assets/logoAseo.png")}
      style={[{ width: 200, height: 200 }, style]}
      resizeMode="contain"
    />
  );
};

export default LogoAseo;