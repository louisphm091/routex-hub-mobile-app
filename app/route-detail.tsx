import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  api,
  API_BASE_URL,
  GET_ALL_SEAT_PATH,
  HOLD_SEAT_PATH,
} from "@/utils/env";
import { genUUID, nowOffsetDateTime } from "@/utils/request";

type RouteSeatStatus = "AVAILABLE" | "HELD" | "SOLD" | "BLOCKED";

type HoldSeatRequest = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  data: {
    routeId: string;
    seatNos: string[];
  };
};

type HoldSeatResponse = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  result?: {
    responseCode: string;
    description: string;
  };
  data?: {
    routeId: string;
    seatNos: string[];
  };
};
type GetAllSeatRequest = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  data: {
    routeId: string;
  };
};

type RouteSeatItems = {
  routeId: string;
  seatNo: string;
  status: RouteSeatStatus;
  ticketId?: string | null;
};

type GetAllSeatResponse = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  result?: {
    responseCode: string;
    description: string;
  };
  data: RouteSeatItems[];
};

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
  stopPoints: [
    {
      id: "d80f95a5-db24-499f-ac6e-bc92d02fbdc2",
      stopOrder: "1",
      routeId: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
      plannedArrivalTime: "2026-03-04T09:30:00Z",
      plannedDepartureTime: "2026-03-04T09:45:00Z",
      note: "Trạm Dừng Chân",
    },
  ],
};

const RouteDetail = () => {
  const params = useLocalSearchParams<{ routeData?: string | string[] }>();
  const raw = params?.routeData;
  const routeDataStr = Array.isArray(raw) ? raw[0] : raw;

  const [routeSeat, setRouteSeat] = useState<RouteSeatItems[]>([]);
  const [loadingSeat, setLoadingSeat] = useState(false);
  const [holdingSeat, setHoldingSeat] = useState(false);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      return;
    }

    const payload: HoldSeatRequest = {
      requestId: genUUID(),
      requestDateTime: nowOffsetDateTime(),
      channel: "ONL",
      data: {
        routeId: routeData.id,
        seatNos: selectedSeats,
      },
    };

    setHoldingSeat(true);

    console.log(routeData.id);
    try {
      const response = await api.post<HoldSeatResponse>(
        HOLD_SEAT_PATH,
        payload,
      );

      const resultCode = response.data?.result?.responseCode;

      if (resultCode && resultCode !== "0000") {
        Alert.alert(
          "Error",
          response.data?.result?.description || "Hold seat failed",
        );
        await fetchRouteSeats();
        return;
      }

      router.push({
        pathname: "/booking",
        params: {
          routeData: JSON.stringify(routeData),
          selectedSeats: JSON.stringify(selectedSeats),
        },
      });
    } catch (error: any) {
      console.log("Hold Seat Error: ", error?.response?.data ?? error);
      Alert.alert("Error", "Unable to hold selected seats");
    }
  };

  const routeData: RouteItem = useMemo(() => {
    if (!routeDataStr) return mockRouteData;

    try {
      return JSON.parse(routeDataStr);
    } catch {
      return mockRouteData;
    }
  }, [routeDataStr]);

  const fetchRouteSeats = useCallback(async () => {
    const payload: GetAllSeatRequest = {
      requestId: genUUID(),
      requestDateTime: nowOffsetDateTime(),
      channel: "ONL",
      data: {
        routeId: routeData.id,
      },
    };

    setLoadingSeat(true);
    try {
      const response = await api.post<GetAllSeatResponse>(
        GET_ALL_SEAT_PATH,
        payload,
      );

      setRouteSeat(response.data?.data ?? []);
    } catch (error: any) {
      console.log("Fetch Route Seat Error: ", error?.response.data ?? error);
      Alert.alert("Error", "Can't fetch Route Seat");
      setRouteSeat([]);
    } finally {
      setLoadingSeat(false);
    }
  }, [routeData.id]);

  const allSeats = useMemo(() => {
    if (!routeSeat || routeSeat.length === 0) return {};

    return [...routeSeat]
      .map((seat) => seat.seatNo)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [routeSeat]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const canContinue = selectedSeats.length > 0;

  const [bottomPanelHeight, setBottomPanelHeight] = useState(0);

  const seatStatusMap = useMemo(() => {
    const map = new Map<string, RouteSeatStatus>();

    routeSeat.forEach((seat) => {
      map.set(seat.seatNo, seat.status);
    });

    return map;
  }, [routeSeat]);

  const toggleSeat = (seatNo: string) => {
    const status = seatStatusMap.get(seatNo) ?? "AVAILABLE";

    if (status === "SOLD" || status === "HELD" || status === "BLOCKED") return;

    setSelectedSeats((prev) =>
      prev.includes(seatNo)
        ? prev.filter((s) => s !== seatNo)
        : [...prev, seatNo],
    );
  };

  useEffect(() => {
    fetchRouteSeats();
  }, [fetchRouteSeats]);

  const stops = [...(routeData.stopPoints ?? [])].sort(
    (a, b) =>
      (parseInt(a.stopOrder, 10) || 0) - (parseInt(b.stopOrder, 10) || 0),
  );

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

          <Text className="text-white font-extrabold text-lg">
            Route Detail
          </Text>

          <MaterialCommunityIcons
            size={26}
            color="white"
            name="dots-horizontal"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: bottomPanelHeight + 24,
        }}
      >
        {/* Route Info */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-3">
              <Text className="text-lg font-extrabold text-gray-900">
                {routeData.origin} → {routeData.destination}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {routeData.routeCode}
              </Text>
            </View>

            <View className="bg-[#EAFBF9] rounded-full px-3 py-1">
              <Text className="text-[#1f615d] font-semibold text-xs">
                {routeData.availableSeats ?? 0} seats left
              </Text>
            </View>
          </View>

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

        {/* Seat legend */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-4">
          <Text className="text-base font-extrabold text-gray-900 mb-4">
            Select seats
          </Text>

          <View className="flex-row justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded bg-white border border-gray-400 mr-2" />
              <Text className="text-xs text-gray-600">Available</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded bg-[#12B3A8] mr-2" />
              <Text className="text-xs text-gray-600">Selected</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded bg-gray-300 mr-2" />
              <Text className="text-xs text-gray-600">Sold</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded bg-[#FFE8E6] mr-2" />
              <Text className="text-xs text-gray-600">Processing</Text>
            </View>
          </View>

          {/* Seat map */}
          {loadingSeat ? (
            <View className="py-6 items-center">
              <Text className="text-gray-500">Loading seat map...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {routeSeat
                .slice()
                .sort((a, b) =>
                  a.seatNo.localeCompare(b.seatNo, undefined, {
                    numeric: true,
                  }),
                )
                .map((seat) => {
                  const seatNo = seat.seatNo;
                  const status = seat.status ?? "AVAILABLE";

                  const isSold = status === "SOLD";
                  const isHeld = status === "HELD";
                  const isBlocked = status === "BLOCKED";
                  const isSelected = selectedSeats.includes(seatNo);

                  const disabled = isSold || isHeld || isBlocked;

                  const bgClass = isSold
                    ? "bg-gray-300"
                    : isHeld
                      ? "bg-[#FFE8E6]"
                      : isBlocked
                        ? "bg-gray-500"
                        : isSelected
                          ? "bg-[#12B3A8]"
                          : "bg-white";

                  const textClass = isSelected
                    ? "text-white"
                    : disabled
                      ? "text-gray-500"
                      : "text-gray-800";

                  return (
                    <Pressable
                      key={`${seat.routeId}-${seatNo}`}
                      disabled={disabled}
                      onPress={() => toggleSeat(seatNo)}
                      className={`w-[22%] mb-3 h-12 rounded-xl border border-gray-300 items-center justify-center ${bgClass}`}
                    >
                      <Text className={`font-semibold ${textClass}`}>
                        {seatNo}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          )}
        </View>

        {/* Stop points */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-4">
          <Text className="text-base font-extrabold text-gray-900 mb-3">
            Stop points
          </Text>

          {stops.length === 0 ? (
            <Text className="text-sm text-gray-500">No stop points</Text>
          ) : (
            stops.map((s, idx) => (
              <View
                key={s.id}
                className={`${idx < stops.length - 1 ? "border-b border-gray-100 pb-3 mb-3" : ""}`}
              >
                <Text className="text-sm font-semibold text-gray-800">
                  Stop {s.stopOrder}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Arrival: {formatTimeHHmm(s.plannedArrivalTime)} • Departure:{" "}
                  {formatTimeHHmm(s.plannedDepartureTime)}
                </Text>
                <Text className="text-sm text-gray-700 mt-1">
                  {s.note || "—"}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View
        onLayout={(e) => {
          setBottomPanelHeight(e.nativeEvent.layout.height);
        }}
        className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2"
        style={{ backgroundColor: "rgba(245,247,250,0.96)" }}
      >
        <View className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-3 shadow-sm">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-xs text-gray-500">Selected seats</Text>
              <Text className="text-base font-extrabold text-gray-900 mt-1">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-xs text-gray-500">Quantity</Text>
              <Text className="text-base font-extrabold text-gray-900 mt-1">
                {selectedSeats.length}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={handleContinue}
          className={`rounded-2xl py-4 mb-4 items-center justify-center shadow-sm ${
            canContinue ? "bg-[#12B3A8]" : "bg-gray-300"
          }`}
        >
          <Text
            className={`font-extrabold text-base ${
              canContinue ? "text-white" : "text-gray-500"
            }`}
          >
            {holdingSeat ? "Processing..." : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RouteDetail;
