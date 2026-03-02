import Header from "@/components/Header";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ArrowPathRoundedSquareIcon,
  ChevronDoubleRightIcon,
} from "react-native-heroicons/outline";

interface RouteOfferData {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  maxResults: number;
}
interface SearchRouteData {
  originCity: string;
  destinationCity: string;
  departureDate: string;
  seat: number;
}
// Trip Options components
interface TripOptionProps {
  pageNavigation: string;
  handleNavigationChange: (type: string) => void;
}

const TripOption: React.FC<TripOptionProps> = ({
  pageNavigation,
  handleNavigationChange,
}) => (
  <View className="flex-row justify-between w-full px-4 py-2">
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("one-way")}
    >
      <View
        className={`w-full justify-center items-center flex-row space-x-2 pb-2
            ${pageNavigation === "one-way" ? "border-b-4 border-[#12B3A8]" : "border-transparent"}`}
      >
        <ChevronDoubleRightIcon
          size={20}
          strokeWidth={pageNavigation === "one-way" ? 3 : 2}
          color={pageNavigation === "one-way" ? "#12B3A8" : "gray"}
        />
        <Text
          className={`text-xl pl-2 ${
            pageNavigation === "one-way" ? "text-[#12B3A8]" : "text-gray-500"
          }`}
          style={{
            fontWeight: pageNavigation === "one-way" ? "700" : "500",
          }}
        >
          One Way
        </Text>
      </View>
    </Pressable>

    {/* Round Trip */}
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("round-trip")}
    >
      <View
        className={`w-full justify-center items-center flex-row space-x-2 pb-2
            ${pageNavigation === "round-trip" ? "border-b-4 border-[#12B3A8]" : "border-transparent"}`}
      >
        <ArrowPathRoundedSquareIcon
          size={20}
          strokeWidth={pageNavigation === "round-trip" ? 3 : 2}
          color={pageNavigation === "round-trip" ? "#12B3A8" : "gray"}
        />
        <Text
          className={`text-xl pl-2 ${
            pageNavigation === "round-trip" ? "text-[#12B3A8]" : "text-gray-500"
          }`}
          style={{
            fontWeight: pageNavigation === "round-trip" ? "700" : "500",
          }}
        >
          Round Trip
        </Text>
      </View>
    </Pressable>
  </View>
);

// Location Component

interface LocationInputProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  icon,
  value,
  onPress,
}) => (
  <View className="border-2 border-gray-300 mx-4 mb-4 rounded-2xl justify-center">
    <Pressable onPress={onPress}>
      <View className="px-4 flex-row justify-between items-center">
        <View className="w-[15%] border-r-2 border-gray-300">{icon}</View>
        <View className="w-[80%] py-3">
          {value ? (
            <Text className="bg-transparent text-gray-600 font-bold">
              {value}
            </Text>
          ) : (
            <Text className="bg-transparent text-lg text-gray-600 font-semibold">
              {placeholder}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  </View>
);

// Departure Date Component
interface DepartureDateProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const DepartureDate: React.FC<DepartureDateProps> = ({
  placeholder,
  icon,
  value,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    className="border-2 border-gray-300 mx-4 mb-4 rounded-2xl justify-center py-4 flex-row items-center pl-4"
  >
    <View className="w-[15%] border-r-2 border-gray-300">{icon}</View>
    <View className="w-[85%] px-4 items-start justify-start">
      <Text className="bg-transparent text-gray-600 font-bold">
        {value || placeholder}
      </Text>
    </View>
  </Pressable>
);

export default function HomeScreen() {
  const [isPending, setIsPending] = useState(false);
  const [pageNavigation, setPageNavigation] = useState("one-way");

  const [routeOfferData, setRouteOfferData] = useState<RouteOfferData>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: new Date(),
    returnDate: new Date(),
    adults: 0,
    maxResults: 10,
  });
  const [searchRouteData, setSearchRouteData] = useState<SearchRouteData>({
    originCity: "",
    destinationCity: "",
    departureDate: "",
    seat: 0,
  });

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleNavigationChange = (type: string) => setPageNavigation(type);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadDepartureDate = async () => {
        try {
          const v = await AsyncStorage.getItem("departureDate");
          if (!mounted) return;

          if (v) {
            setSelectedDate(v);
            setSearchRouteData((prev) => ({ ...prev, departureDate: v }));
          }
        } catch (e) {
          console.log("loadDepartureDate error:", e);
        }
      };

      loadDepartureDate();

      return () => {
        mounted = false;
      };
    }, []),
  );

  const handleParentSearch = async () => {
    const searchUrl = constructSearchUrl();
    setIsPending(true);

    if (searchUrl) {
      try {
        const response = await axios.get(searchUrl, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });

        if (response.data) {
          setIsPending(false);
          await AsyncStorage.setItem(
            "searchRouteData",
            JSON.stringify(searchRouteData),
          );

          router.push({
            pathname: "/searchresult",
            params: {
              routeOfferData: JSON.stringify(routeOfferData),
            },
          });
        }
      } catch (error) {
        console.error("Error fetching flight offers", error);
      }
    }
  };

  const constructSearchUrl = () => {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      maxResults,
    } = routeOfferData;

    const formattedDepartureDate = departureDate.replace(/^"|"$/g, "");

    if (
      !originLocationCode ||
      !destinationLocationCode ||
      !departureDate ||
      !adults
    ) {
      Alert.alert("Error", "Please fill all the required fields");
    }

    return `${apiBaseUrl}?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}$departureDate=${departureDate}&adults=${adults}`;
  };

  return (
    <View className="flex-1 items-center bg-[#F5F7FA] relative">
      <StatusBar style="light" />
      {isPending && (
        <View className="absolute z-50 w-full h-full justify-center items-center">
          <View className="bg-[#000000] bg-opacity-50 h-full w-full justfiy-center items-center opacity-[0.45]"></View>
          <View className="absolute">
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{
                paddingTop: 20,
              }}
            />
          </View>
        </View>
      )}

      {/* Header */}
      <View
        className="h-64 mb-4 justify-start border-orange-600 w-full bg-[#192031] relative pt-16"
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Header />
      </View>

      {/* Form Area */}
      <View className="w-full px-4 -mt-32 mx-4">
        <View className="bg-white rounded-3xl pt-2 pb-4 shadow-md shadow-slate-300">
          <View className="flex-row justify-between w-full px-4 py-2">
            <TripOption
              pageNavigation={pageNavigation}
              handleNavigationChange={handleNavigationChange}
            />
          </View>
          {/* Departure City */}
          <LocationInput
            placeholder={
              searchRouteData.originCity
                ? searchRouteData.originCity
                : "Departure City"
            }
            icon={<FontAwesome5 size={20} color="gray" name="bus" />}
            value={searchRouteData.originCity}
            onPress={() => router.push("/departure")}
          />

          {/* Destination City  */}
          <LocationInput
            placeholder={
              searchRouteData.destinationCity
                ? searchRouteData.destinationCity
                : "Destination City"
            }
            icon={<FontAwesome5 size={20} color="gray" name="map-marker-alt" />}
            value={searchRouteData.destinationCity}
            onPress={() => {}}
          />

          {/* Departure Date */}
          <DepartureDate
            placeholder="Departure Date"
            icon={<FontAwesome5 size={20} color="gray" name="calendar-alt" />}
            value={selectedDate || searchRouteData.departureDate}
            onPress={() => router.push("/departureDate")}
          />

          {/* Seat  */}
          <View className="border-2 border-gray-300  border-r-2 mx-4 rounded-2xl py-3 justify-center items-center flex-row pl-4">
            <View>
              <MaterialCommunityIcons
                size={20}
                color="gray"
                name="seat-passenger"
              />
            </View>

            <TextInput
              className="w-[85%] text-base px-4 font-semibold"
              placeholder="Seat"
              keyboardType="numeric"
              value={String(searchRouteData.seat)}
              onChangeText={(text) => {
                const seatValue = parseInt(text, 10);
                const validSeatValue = isNaN(seatValue) ? 0 : seatValue;
                setSearchRouteData((prev) => ({
                  ...prev,
                  seat: validSeatValue,
                }));

                setRouteOfferData((prev) => ({
                  ...prev,
                  adults: validSeatValue,
                }));
              }}
            />
          </View>

          {/* Search Button */}
          <View className="w-full justify-start pt-2 px-4 mt-2">
            <Pressable
              className="bg-[#12B3A8] rounded-lg justify-center items-center py-4"
              onPress={() => {}}
            >
              <Text className="text-white font-bold text-lg">Search</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
