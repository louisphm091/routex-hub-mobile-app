import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canRegister =
    fullName.trim().length > 0 &&
    username.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0;

  const handleRegister = () => {
    if (!canRegister) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password and Confirm Password do not match");
      return;
    }

    Alert.alert("Register", "Register successfully");
    // TODO: call register API

    router.back();
  };

  return (
    <View className="flex-1 bg-[#F5F7FA]">
      <View
        className="w-full bg-[#192031] pt-16 pb-6"
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View className="flex-row items-center justify-between px-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-500 items-center justify-center"
          >
            <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
          </Pressable>

          <Text className="text-white font-extrabold text-lg">Register</Text>

          <MaterialCommunityIcons
            size={26}
            color="white"
            name="dots-horizontal"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-[#12B3A8] items-center justify-center mb-4">
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={40}
              color="white"
            />
          </View>

          <Text className="text-2xl font-extrabold text-gray-900">
            Create account
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Register to manage routes, vehicles and bookings
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-5 border border-gray-100">
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="gray"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="gray"
              autoCapitalize="none"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Phone number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="gray"
              secureTextEntry
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            />
          </View>

          <View className="mb-2">
            <Text className="text-xs text-gray-500 mb-2">Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="gray"
              secureTextEntry
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900"
            />
          </View>

          <Pressable
            disabled={!canRegister}
            onPress={handleRegister}
            className={`rounded-2xl py-4 items-center justify-center mt-5 ${
              canRegister ? "bg-[#12B3A8]" : "bg-gray-300"
            }`}
          >
            <Text
              className={`font-extrabold text-base ${
                canRegister ? "text-white" : "text-gray-500"
              }`}
            >
              Create Account
            </Text>
          </Pressable>

          <View className="flex-row justify-center items-center mt-5">
            <Text className="text-gray-500">Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-[#12B3A8] font-extrabold">Login</Text>
            </Pressable>
          </View>Header
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
