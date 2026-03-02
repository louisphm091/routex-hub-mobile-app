import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

const index = () => {
    return (
        <SafeAreaView className="flex-1" style={{
            backgroundColor: "#192031",
        }}>
            <StatusBar style="light" />
            <View className="h-full">
                <View
                    className="w-full px-4 items-center my-8">
                    <Animated.View
                        entering={FadeInDown.duration(200).springify()}
                        className="flex-row justify-center items-center pb-24">
                        <MaterialCommunityIcons name="bus" size={24} color="#12B3A8" />

                        <Text className="text-[#FFFFFF] text-xl leading-[60px] pl-1">ROUTEX</Text>
                        <Text className="text-[#4AE8DD] text-xl leading-[60px] pl-1 italic">GO</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.duration(200).delay(200).springify()}>
                        <Text className="text-[#FFFFFF] text-[52px] font-medium leading-[60px]">
                            Discover your Dream Route Easily
                        </Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.duration(200).delay(400).springify()}
                        className="mt-4">
                        <Text className="text-neutral-300 text-lg font-medium leading-[38px]">
                            find an easy way to buy bus tickets with just a few clicks in the application.
                        </Text>
                    </Animated.View>

                    <Animated.View
                    entering={FadeInDown.duration(200).delay(600).springify()}
                    className="h-1/4 w-full justify-start pt-8 px-4">
                        <Pressable
                        onPress={() => router.push("/(tabs)")}
                        className="bg-[#12B3A8] justify-center rounded-lg items-center py-4">
                            <Text className="text-white font-bold text-lg">Discover</Text>
                        </Pressable>

                        <View className="flex-row mt-4 justify-center gap-2">
                            <Text className="text-neutral-300 font-medium text-lg leading-[38px] text-center">Don&apos;t have an account ?</Text>
                            <Text className="text-neutral-300 font-semibold text-lg leading-[38px] text-center">Register</Text>
                        </View>
                    </Animated.View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default index
