import React, { useState } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");

const LoginSignButton = ({ colors, onSwitch } :any) => {
  const [selected, setSelected] = useState("login");

  const handleSwitch = (type :any) => {
    setSelected(type);
    if (onSwitch) {
      onSwitch(type);
    }
  };

  return (
    <View
      style={{
        height: 45,
        backgroundColor: "#EFF0F6",
        width: windowWidth - 20,
        marginTop: 20,
        marginHorizontal: 10,
        flexDirection: "row",
        borderRadius: 10,
        padding: 5,
      }}
    >
      {/* Login Button */}
      <TouchableOpacity
        onPress={() => handleSwitch("login")}
        style={{
          flex: 1,
          backgroundColor: selected === "login" ? colors.white : "transparent",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: selected === "login" ? colors.scarletRed : colors.titleColor, fontWeight: "600" }}>
          Log In
        </Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={() => handleSwitch("signup")}
        style={{
          flex: 1,
          backgroundColor: selected === "signup" ? colors.white : "transparent",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: selected === "signup" ? colors.scarletRed : colors.titleColor, fontWeight: "600" }}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginSignButton;
