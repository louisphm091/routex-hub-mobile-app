import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, Octicons } from "@expo/vector-icons";

const HeaderSearchResult = () => {
  const [searchRouteData, setSearchRouteData] = useState<any>(null);

  const originCity = searchRouteData?.originCity || "";
  const destinationCity = searchRouteData?.destinationCity || "";
  const departureDate = searchRouteData?.departureDate || "";
  const returnDate = searchRouteData?.returnDate || "";
  const seats = searchRouteData?.seats || 0;

  const formattedDepartureDate = departureDate?.replace(/['"]+/g, "");

  useEffect(() => {
    const fetchSearchRouteData = async () => {
      try {
        const data = await AsyncStorage.getItem("searchRouteData");
        if (data !== null) {
          setSearchRouteData(JSON.parse(data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSearchRouteData();
  }, []);

  return (
    <>
      {/* !searchRouteData just for testing before API Integration  */}
      {!searchRouteData && (
        <View>
          <View className="flex-row justify-center items-center px-2 w-full">
            <View className="w-[70%] justify-between items-center flex-row pb-2">
              <Text className="text-lg text-white font-extrabold caption-top">
                {originCity || "Paris"}
              </Text>

              <Feather name="arrow-right" size={24} color="white" />
              <Text className="text-lg text-white font-extrabold caption-top">
                {destinationCity || "England"}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-center items-center px-2 w-full">
            <View className="w-[80%] justify-between items-center flex-row">
              <Text className="text-sm text-neutral-400 font-extrabold">
                {formattedDepartureDate || "12-03-2026"}
              </Text>
              <Octicons name="dot-fill" size={10} color="white" />
              <Text className="text-sm text-neutral-400 font-extrabold">
                {seats || "02"} Seats
              </Text>
              <Octicons name="dot-fill" size={10} color="white" />
              <Text className="text-sm text-neutral-400 font-extrabold">
                Economy
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default HeaderSearchResult;
