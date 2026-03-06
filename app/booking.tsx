import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type StopPoint = {
  id: string;
  stopOrder: string;
  routeId: string;
  plannedArrivalTime?: string;
  plannedDepartureTime?: string;
  note?: string;
};

type RouteItem = {
  id: string;
  pickupBranch?: string | null;
  origin: string;
  destination: string;
  availableSeats?: number | null;
  plannedStartTime: string;
  plannedEndTime: string;
  routeCode: string;
  vehiclePlate?: string | null;
  vehicleType?: string | null;
  seatCapacity?: number | null;
  stopPoints?: StopPoint[] | null;
  price?: number | null;
  currency?: string | null;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatTimeHHmm = (iso?: string) => {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatDateDDMMYYYY = (iso?: string) => {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const durationText = (startIso?: string, endIso?: string) => {
  if (!startIso || !endIso) return "--";
  const s = new Date(startIso).getTime();
  const e = new Date(endIso).getTime();
  const diff = Math.max(0, e - s);

  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const formatVnd = (value?: number | null) => {
  if (typeof value !== "number") return "—";
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
};

const Booking = () => {
  const params = useLocalSearchParams<{
    routeData?: string | string[];
    selectedSeats?: string | string[];
  }>();

  const rawRouteData = params?.routeData;
  const rawSelectedSeats = params?.selectedSeats;

  const routeDataStr = Array.isArray(rawRouteData)
    ? rawRouteData[0]
    : rawRouteData;
  const selectedSeatsStr = Array.isArray(rawSelectedSeats)
    ? rawSelectedSeats[0]
    : rawSelectedSeats;

  const routeData: RouteItem = useMemo(() => {
    const mockRouteData: RouteItem = {
      id: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
      pickupBranch: "233 Dien Bien Phu",
      origin: "Hà Nội",
      destination: "Hải Phòng",
      availableSeats: 32,
      plannedStartTime: "2026-03-04T07:30:00Z",
      plannedEndTime: "2026-03-04T13:30:00Z",
      routeCode: "HAN-HPH-06",
      vehiclePlate: "51B-123.45",
      vehicleType: "LIMOUSINE",
      seatCapacity: 34,
      price: 320000,
      currency: "VND",
      stopPoints: [],
    };

    if (!routeDataStr) return mockRouteData;
    try {
      return JSON.parse(routeDataStr);
    } catch {
      return mockRouteData;
    }
  }, [routeDataStr]);

  const selectedSeats: string[] = useMemo(() => {
    if (!selectedSeatsStr) return [];
    try {
      return JSON.parse(selectedSeatsStr);
    } catch {
      return [];
    }
  }, [selectedSeatsStr]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");

  const unitPrice = routeData.price ?? 0;
  const totalAmount = unitPrice * selectedSeats.length;

  const canContinue =
    customerName.trim().length > 0 &&
    customerPhone.trim().length > 0 &&
    selectedSeats.length > 0;

  return (
    <View className="flex-1 bg-[#F5F7FA]">
      {/* Header */}
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

          <Text className="text-white font-extrabold text-lg">Booking</Text>

          <MaterialCommunityIcons
            size={26}
            color="white"
            name="dots-horizontal"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
      >
        {/* Route summary */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-lg font-extrabold text-gray-900">
            {routeData.origin} → {routeData.destination}
          </Text>

          <Text className="text-sm text-gray-500 mt-1">
            {routeData.routeCode}
          </Text>

          <View className="mt-4 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-extrabold text-gray-900">
                {formatTimeHHmm(routeData.plannedStartTime)}
              </Text>
              <Text className="text-xs text-gray-500">Depart</Text>
            </View>

            <View className="items-center">
              <Text className="text-xs text-gray-500">
                {durationText(
                  routeData.plannedStartTime,
                  routeData.plannedEndTime,
                )}
              </Text>
              <View className="w-24 h-[2px] bg-gray-200 mt-1 mb-1 rounded-full" />
              <Text className="text-xs text-gray-500">
                {formatDateDDMMYYYY(routeData.plannedStartTime)}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-lg font-extrabold text-gray-900">
                {formatTimeHHmm(routeData.plannedEndTime)}
              </Text>
              <Text className="text-xs text-gray-500">Arrive</Text>
            </View>
          </View>

          <View className="mt-4 border-t border-gray-100 pt-4">
            <Text className="text-xs text-gray-500">Pickup branch</Text>
            <Text className="text-sm text-gray-800 font-semibold mt-1">
              {routeData.pickupBranch || "—"}
            </Text>

            <Text className="text-xs text-gray-500 mt-3">Vehicle</Text>
            <Text className="text-sm text-gray-800 font-semibold mt-1">
              {routeData.vehicleType || "—"} • {routeData.vehiclePlate || "—"}
            </Text>
          </View>
        </View>

        {/* Selected seats */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-4">
          <Text className="text-base font-extrabold text-gray-900 mb-3">
            Selected seats
          </Text>

          {selectedSeats.length === 0 ? (
            <Text className="text-sm text-gray-500">No seats selected</Text>
          ) : (
            <View className="flex-row flex-wrap">
              {selectedSeats.map((seat) => (
                <View
                  key={seat}
                  className="bg-[#EAFBF9] rounded-full px-3 py-2 mr-2 mb-2"
                >
                  <Text className="text-[#1f615d] font-semibold">{seat}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Customer information */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-4">
          <Text className="text-base font-extrabold text-gray-900 mb-3">
            Customer information
          </Text>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Full name</Text>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter full name"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              placeholderTextColor="gray"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Phone number</Text>
            <TextInput
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              placeholderTextColor="gray"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Email</Text>
            <TextInput
              value={customerEmail}
              onChangeText={setCustomerEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              placeholderTextColor="gray"
            />
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-2">Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Additional note"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 min-h-[100px]"
              placeholderTextColor="gray"
            />
          </View>
        </View>

        {/* Payment summary */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-4">
          <Text className="text-base font-extrabold text-gray-900 mb-3">
            Payment Summary
          </Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-500">Seat quantity</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {selectedSeats.length}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-500">Unit price</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatVnd(unitPrice)}
            </Text>
          </View>

          <View className="border-t border-gray-100 pt-3 mt-3 flex-row justify-between items-center">
            <Text className="text-base font-extrabold text-gray-900">
              Total
            </Text>
            <Text className="text-base font-extrabold text-[#12B3A8]">
              {formatVnd(totalAmount)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2"
        style={{ backgroundColor: "rgba(245,247,250,0.96)" }}
      >
        <View className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-xs text-gray-500">Passenger</Text>
              <Text className="text-base font-extrabold text-gray-900 mt-1">
                {customerName.trim().length > 0 ? customerName : "Not entered"}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-xs text-gray-500">Total amount</Text>
              <Text className="text-base font-extrabold text-gray-900 mt-1">
                {formatVnd(totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={() => {
            if (!canContinue) {
              Alert.alert("Error", "Please fill required information");
              return;
            }

            Alert.alert(
              "Confirm booking",
              `Customer: ${customerName}\nPhone: ${customerPhone}\nSeats: ${selectedSeats.join(", ")}\nTotal: ${formatVnd(totalAmount)}`,
            );

            // TODO:
            // call create booking / confirm booking API
            // router.push("/payment")
          }}
          className={`rounded-2xl py-4 mb-4 items-center justify-center shadow-sm ${
            canContinue ? "bg-[#12B3A8]" : "bg-gray-300"
          }`}
        >
          <Text
            className={`font-extrabold text-base ${
              canContinue ? "text-white" : "text-gray-500"
            }`}
          >
            Confirm booking
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Booking;
