import { View, Text, Image } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View className="flex-row justify-between items-center px-4">
      <View className="w-1/2 flex-row h-14 items-center">
        <View className="pr-2">
          <View className="overflow-hidden">
            <Image
              source={require("../assets/images/react-logo.png")}
              className="w-12 h-12 border-2 border-white rounded-full"
            />
          </View>
        </View>
        <View>
          <Text className="text-base text-neutral-400 font-medium">
            Welcome Back
          </Text>
          <Text className="text-xl text-white font-bold">
            Louis !
          </Text>
        </View>
      </View>
      <View className="w-1/2 flex-row space-x-4 justify-end items-center h-14">
        <View className="bg-gray-600 w-fit rounded-full px-4 justify-center h-full flex-row items-center gap-2">
            <View className="bg-gray-500 rounded-full w-8 h-8 justify-center items-center">
                <Text className="text-white font-semibold">P</Text>
            </View>

            <View className="justify-start items-start gap-1">
                <Text className="text-base text-gray-400">Route Point</Text>
                <Text className="text-white">🚎 5,231</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
