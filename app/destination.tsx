import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { api, API_BASE_URL, SEARCH_LOCATION_PATH } from "@/utils/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LocationItem {
  id: number;
  name: string;
  code: string;
}

const Destination = () => {
  const [searchInput, setSearchInput] = useState("");
  const [autoCompleteResult, setAutoCompleteResults] = useState<LocationItem[]>(
    [],
  );

  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLocation = useCallback(async (keyword: string) => {
    const kw = keyword.trim();
    if (kw.length === 0) {
      setAutoCompleteResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(SEARCH_LOCATION_PATH, {
        params: { keyword: kw, page: 0, size: 10 },
      });

      const list: LocationItem[] = response.data?.data ?? [];
      setAutoCompleteResults(list);
    } catch (error) {
      console.log(error);
      setAutoCompleteResults([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleInputChange = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchLocation(value);
    }, 250);
  };
  return (
    <View className="flex-1 items-center bg-[#F5F7FA]">
      <View className="w-full h-full">
        {/* Header */}
        <View
          className="justify-start w-full bg-[#192031] relative pt-16 pb-8"
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
                Select Destination
              </Text>
            </View>

            <MaterialCommunityIcons
              size={30}
              color="white"
              name="dots-horizontal"
            />
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
                className="bg-transparent text-gray-600 h-full px-2"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Autocomplete Results */}
          {(loading || autoCompleteResult.length > 0) && (
            <View className="border-2 border-gray-200 bg-white rounded-xl shadow-sm mt-3 overflow-hidden">
              {loading && (
                <View className="py-3 items-center">
                  <ActivityIndicator />
                </View>
              )}

              <FlatList
                keyboardShouldPersistTaps="handled"
                data={autoCompleteResult}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={async () => {
                      // chọn xong thì set input và đóng list
                      setSearchInput(item.name);
                      setAutoCompleteResults([]);
                      await AsyncStorage.multiSet([
                        ["destinationCity", item.name],
                        ["destinationCode", item.code],
                      ]);
                      router.back();
                    }}
                    className="px-3 py-3 border-b border-gray-100"
                  >
                    <Text className="text-gray-700">
                      {item.name} ({item.code})
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Destination;
