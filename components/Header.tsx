import { View, Text, Pressable } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  isLoggedIn: boolean;
  userName: string;
  routePoint?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  userName,
  routePoint,
}) => {
  const displayName = userName?.trim()?.length > 0 ? userName : "Customer";

  return (
    <View className="px-4">
      {/* Top row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-white text-[26px] font-extrabold">
            {isLoggedIn
              ? `Welcome back, ${displayName}!`
              : "Welcome, Customer!"}
          </Text>

          <Text className="text-gray-300 mt-2 leading-5">
            {isLoggedIn
              ? "Manage routes, bookings and seat inventory with ease."
              : "Search routes, choose seats and book your next trip easily."}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (!isLoggedIn) {
              router.push("/login");
            }
          }}
          className={`w-14 h-14 rounded-full items-center justify-center ${
            isLoggedIn ? "bg-[#12B3A8]" : "bg-[#2C364D]"
          }`}
        >
          <MaterialCommunityIcons
            name={isLoggedIn ? "account" : "account-outline"}
            size={28}
            color="white"
          />
        </Pressable>
      </View>

      {/* Bottom card */}
      <View className="mt-5 bg-[#263148] rounded-2xl px-4 py-4 flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          {isLoggedIn ? (
            <>
              <Text className="text-gray-300 text-xs">Route Point</Text>
              <Text className="text-white text-xl font-extrabold mt-1">
                {routePoint || "0"}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Continue booking to earn more points
              </Text>
            </>
          ) : (
            <>
              <Text className="text-gray-300 text-xs">Guest access</Text>
              <Text className="text-white text-lg font-extrabold mt-1">
                Explore available trips
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Sign in to save bookings and track route points
              </Text>
            </>
          )}
        </View>

        <View className="items-center justify-center">
          <View className="w-12 h-12 rounded-full bg-[#1E9E95] items-center justify-center">
            <MaterialCommunityIcons
              name={isLoggedIn ? "map-marker-path" : "bus-clock"}
              size={24}
              color="white"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
