import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const canLogin = username.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    if (!canLogin) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    Alert.alert("Login", `Username: ${username}`);
    // TODO: call login API
  };

  return (
    <View className="flex-1 bg-[#F5F7FA] px-4 pt-16">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-[#192031] items-center justify-center mb-4">
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={42}
            color="white"
          />
        </View>

        <Text className="text-2xl font-extrabold text-gray-900">Login</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Sign in to manage routes, vehicles and bookings
        </Text>
      </View>

      <View className="bg-white rounded-3xl p-5 border border-gray-100">
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-2">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="gray"
            className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-2">
          <Text className="text-xs text-gray-500 mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="gray"
            className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            secureTextEntry
          />
        </View>

        <Pressable
          disabled={!canLogin}
          onPress={handleLogin}
          className={`rounded-2xl py-4 items-center justify-center mt-5 ${
            canLogin ? "bg-[#12B3A8]" : "bg-gray-300"
          }`}
        >
          <Text
            className={`font-extrabold text-base ${
              canLogin ? "text-white" : "text-gray-500"
            }`}
          >
            Sign In
          </Text>
        </Pressable>

        {/* Register redirect */}
        <View className="flex-row justify-center items-center mt-5">
          <Text className="text-gray-500">Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text className="text-[#12B3A8] font-extrabold">Register</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Login;
