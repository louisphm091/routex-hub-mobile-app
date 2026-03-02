import { View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

const DepartureScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const [autoCompleteResult, setAutoCompleteResults] = useState([]);

  const handleInputChange = (value: string) => {
    setSearchInput(value);
  };

  return (
    <View className="flex-1 items-center bg-[#F5F7FA]">
      <View className="w-full h-full">
        <View
          className="justify-start border-orange-600 w-full bg-[#192031] relative pt-16 pb-8"
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View>
            {/* Header */}
            <View className="flex-row gap-4 justify-start items-center px-2">
              <Pressable
                onPress={() => router.back()}
                className="flex-row  items-center justify-center h-14 w-[20%]"
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
                  Select Departure
                </Text>
              </View>

              <View className="">
                <View>
                  <MaterialCommunityIcons
                    size={30}
                    color="white"
                    name="dots-horizontal"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* City Search */}

        <View className="w-full py-4 px-4 relative">
          <View className="flex-row justify-between items-center bg-white border-2 border-gray-400 rounded-xl h-14 overflow-hidden">
            <View className="w-full h-full justify-center">
              <TextInput
                placeholder="Search for City"
                placeholderTextColor={"gray"}
                value={searchInput}
                onChangeText={handleInputChange}
                className="bg-transparent text-gray-600 h-full px-2 capitalize"
              />
            </View>
          </View>

          {/* Autocomplete Results
          {setAutoCompleteResults.length > 0 && (
            <View className="border-2 border-gray-400 bg-white rounded-xl shadow-sm mt-4">
              <FlatList
                data={setAutoCompleteResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {}}
                    className="px-2 py-2 rounded-xl my-1"
                  >
                    <Text className="text-gray-500 capitalize">
                      {item.name} ({item.iatacode})
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )} */}
        </View>
      </View>
    </View>
  );
};

export default DepartureScreen;
