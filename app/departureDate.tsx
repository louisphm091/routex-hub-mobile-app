import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const DepartureDate = () => {
  const [routeOfferData, setRouteOfferData] = useState<any>({
    departureDate: new Date(),
  });

  const saveDepartureDate = async () => {
    try {
      const departureDate = new Date(routeOfferData.departureDate);
      const dateString = departureDate.toISOString().split("T")[0];

      await AsyncStorage.setItem("departureDate", dateString);

      Alert.alert("Success", "Departure date saved successfully");
      router.back();
    } catch (error: any) {
      console.log("saveDepartureDate error:", error);
      Alert.alert("Error", error?.message ?? "Failed to save departure date");
    }
  };
  return (
    <View className="flex-1 items-center bg-[#F5F7FA]">
      <View className="w-full h-full">
        <SafeAreaView edges={["top"]} className="bg-[#192031]">
          <View
            className="px-4 pt-3 pb-4"
            style={{
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
            }}
          >
            <View className="flex-row items-center">
              {/* Left */}
              <Pressable
                onPress={() => router.back()}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                hitSlop={10}
              >
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={28}
                  color="white"
                />
              </Pressable>

              {/* Center */}
              <View className="flex-1 items-center">
                <Text className="text-white text-lg font-extrabold">
                  Departure Date
                </Text>
              </View>

              {/* Right */}
              <Pressable
                onPress={saveDepartureDate}
                className="px-4 py-2 rounded-full bg-white/10"
                hitSlop={10}
              >
                <Text className="text-white font-bold">Save</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>

        {/* Calendar View */}

        <Calendar
          onDayPress={(day: any) => {
            setRouteOfferData({
              ...routeOfferData,
              departureDate: new Date(day.dateString),
            });
          }}
          markedDates={{
            [routeOfferData.departureDate.toISOString().split("T")[0]]: {
              selected: true,
              selectedColor: "#12B3A8",
              selectedTextColor: "white",
              disableTouchEvent: true,
            },
          }}
        />
      </View>
    </View>
  );
};

export default DepartureDate;
