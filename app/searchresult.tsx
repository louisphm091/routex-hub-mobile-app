import { View, Text, Pressable, FlatList } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import HeaderSearchResult from "@/components/HeaderSearchResult";
import Ticket, { RouteItem } from "@/components/Ticket";

type SearchRouteResponse = {
  requestId?: string;
  requestDateTime?: string;
  channel?: string;
  result?: { responseCode: string; description: string };
  data: RouteItem[];
};

const SearchResult = () => {
  const mockRouteData: SearchRouteResponse = {
    data: [
      {
        id: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
        pickupBranch: "233 Dien Bien Phu",
        origin: "Hà Nội",
        destination: "Hải Phòng",
        availableSeats: 32,
        plannedStartTime: "2026-03-04T07:30:00Z",
        plannedEndTime: "2026-03-04T13:30:00Z",
        routeCode: "HAN-HPH-06",
        stopPoints: [
          {
            id: "d80f95a5-db24-499f-ac6e-bc92d02fbdc2",
            stopOrder: "1",
            routeId: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
            plannedArrivalTime: "2026-03-04T09:30Z",
            plannedDepartureTime: "2026-03-04T09:45Z",
            note: "Tram Dung Chan",
          },
        ],
      },
    ],
  };

  const params = useLocalSearchParams<any>();
  const { routeOfferData } = params;

  const parsed: SearchRouteResponse = routeOfferData
    ? JSON.parse(routeOfferData)
    : mockRouteData;

  const list = parsed?.data ?? [];

  return (
    <View className="flex-1 items-center bg-[#F5F7FA]">
      <View className="w-full h-full">
        {/* Header */}
        <View
          className="justify-start border-orange-600 w-full bg-[#192031] relative pt-16 pb-8"
          style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
        >
          <View className="flex-row gap-4 justify-start items-center px-2">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center justify-center h-14 w-[20%]"
            >
              <View className="rounded-full bg-gray-500 h-10 w-10 justify-center items-center">
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={30}
                  color="white"
                />
              </View>
            </Pressable>

            <View className="w-[60%] justify-center items-center flex-row">
              <Text className="text-lg text-white font-extrabold">
                Search Result
              </Text>
            </View>

            <MaterialCommunityIcons
              size={30}
              color="white"
              name="dots-horizontal"
            />
          </View>

          <HeaderSearchResult />
        </View>

        {/* List */}
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 24,
          }}
          ListHeaderComponent={
            <View className="flex-row justify-between items-center mb-3 px-1">
              <Text className="text-lg font-semibold">Trips</Text>
              <Text className="text-[#6B7386] font-semibold text-base">
                {list.length} Result{list.length > 1 ? "s" : ""}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/route-detail",
                  params: { routeData: JSON.stringify(item) },
                });
              }}
              className="mb-4"
            >
              <Ticket item={item} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="pt-10 items-center">
              <Text className="text-gray-500">No trips found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default SearchResult;
