import { View, Text, Pressable } from "react-native";
import React, { useMemo, useState } from "react";

type StopPoint = {
  id: string;
  stopOrder: string;
  routeId: string;
  plannedArrivalTime?: string;
  plannedDepartureTime?: string;
  note?: string;
};

export type RouteItem = {
  id: string;
  pickupBranch?: string | null;
  origin: string;
  destination: string;
  availableSeats?: number | null;
  plannedStartTime: string;
  plannedEndTime: string;
  routeCode: string;
  stopPoints?: StopPoint[] | null;

  // future fields
  price?: number | null;
  currency?: "VND" | string;
  vehicleType?: string | null;
  seatCapacity?: number | null;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatTimeHHmm = (iso: string) => {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatDateDDMM = (iso: string) => {
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
};

const durationText = (startIso: string, endIso: string) => {
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

const sortStops = (stops?: StopPoint[] | null) => {
  if (!stops || stops.length === 0) return [];
  return [...stops].sort(
    (a, b) =>
      (parseInt(a.stopOrder, 10) || 0) - (parseInt(b.stopOrder, 10) || 0),
  );
};

const formatVnd = (v?: number | null) => {
  if (typeof v !== "number") return "—";
  try {
    return new Intl.NumberFormat("vi-VN").format(v) + " ₫";
  } catch {
    return `${v} ₫`;
  }
};

const toVehicleLabel = (type?: string | null, cap?: number | null) => {
  if (!type && !cap) return "—";
  if (type && cap) return `${type} • ${cap} chỗ`;
  if (type) return type;
  return `${cap} chỗ`;
};

const Ticket = ({ item }: { item: RouteItem }) => {
  const [expanded, setExpanded] = useState(false);

  const startTime = formatTimeHHmm(item.plannedStartTime);
  const endTime = formatTimeHHmm(item.plannedEndTime);
  const date = formatDateDDMM(item.plannedStartTime);
  const dur = durationText(item.plannedStartTime, item.plannedEndTime);

  const seats =
    typeof item.availableSeats === "number" ? item.availableSeats : null;
  const lowSeat = typeof seats === "number" && seats > 0 && seats <= 3;

  const stops = useMemo(() => sortStops(item.stopPoints), [item.stopPoints]);
  const stopCount = stops.length;

  const priceText = formatVnd(item.price || 50000);
  const vehicleLabel = toVehicleLabel(item.vehicleType, item.seatCapacity);

  return (
    <View className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header row */}
      <View className="px-4 pt-4 flex-row justify-between items-start">
        <View className="flex-1 pr-3">
          <Text className="text-base font-extrabold text-gray-900">
            {item.origin} → {item.destination}
          </Text>

          <Text className="text-xs text-gray-500 mt-1">
            {item.routeCode} • {date}
          </Text>

          {!!item.pickupBranch && (
            <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
              Pickup:{" "}
              <Text className="text-gray-700 font-semibold">
                {item.pickupBranch}
              </Text>
            </Text>
          )}

          <Text className="text-xs text-gray-500 mt-1">
            Loại xe:
            <Text className="text-gray-700 font-semibold">{vehicleLabel}</Text>
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-base font-extrabold text-gray-900">
            {priceText}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Giá / vé</Text>

          {lowSeat && (
            <View className="mt-2 bg-[#FFE8E6] rounded-full px-3 py-1">
              <Text className="text-xs text-[#B42318] font-semibold">
                Only {seats} seats left
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Time row */}
      <View className="px-4 mt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-extrabold text-gray-900">
            {startTime}
          </Text>
          <Text className="text-xs text-gray-500">Depart</Text>
        </View>

        <View className="items-center">
          <Text className="text-xs text-gray-500">{dur}</Text>
          <View className="w-24 h-[2px] bg-gray-200 mt-1 mb-1 rounded-full" />
          <Text className="text-xs text-gray-500">
            {stopCount === 0
              ? "Direct"
              : `${stopCount} stop${stopCount > 1 ? "s" : ""}`}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-lg font-extrabold text-gray-900">
            {endTime}
          </Text>
          <Text className="text-xs text-gray-500">Arrive</Text>
        </View>
      </View>

      {/* Bottom row */}
      <View className="px-4 py-4 mt-3 border-t border-gray-100">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-gray-500">Available seats</Text>
            <Text className="text-base font-extrabold text-gray-900">
              {seats === null ? "—" : seats}
            </Text>
          </View>

          {stopCount > 0 ? (
            <Pressable
              onPress={() => setExpanded((v) => !v)}
              className="bg-gray-100 rounded-full px-3 py-2"
            >
              <Text className="text-xs font-semibold text-gray-700">
                {expanded ? "Hide stops" : "View stops"}
              </Text>
            </Pressable>
          ) : (
            <View className="bg-gray-100 rounded-full px-3 py-2">
              <Text className="text-xs font-semibold text-gray-600">
                No stops
              </Text>
            </View>
          )}
        </View>

        {/* Expanded stops */}
        {expanded && stopCount > 0 && (
          <View className="mt-3 bg-[#F7F8FA] rounded-xl p-3">
            {stops.map((s, idx) => {
              const arr = s.plannedArrivalTime
                ? formatTimeHHmm(s.plannedArrivalTime)
                : "—";
              const dep = s.plannedDepartureTime
                ? formatTimeHHmm(s.plannedDepartureTime)
                : "—";
              return (
                <View
                  key={s.id ?? `${idx}`}
                  className={`py-2 ${idx < stops.length - 1 ? "border-b border-gray-200" : ""}`}
                >
                  <Text className="text-sm font-semibold text-gray-800">
                    Stop {s.stopOrder}: {s.note ? s.note : "—"}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Arrival {arr} • Departure {dep}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default Ticket;
