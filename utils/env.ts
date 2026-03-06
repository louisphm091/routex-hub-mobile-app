import axios from "axios";
import { encode as btoa } from "base-64";

// src/utils/env.ts
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://192.168.99.146:8000";

export const SEARCH_LOCATION_PATH =
  "/api/v1/management/location-service/search";

export const GET_ALL_SEAT_PATH = "/api/v1/management/route-service/get-seats";

export const SEARCH_ROUTE_PATH = "/api/v1/management/route-service/search";

const USERNAME = "admin";
const PASSWORD = "admin";

const basicToken = btoa(`${USERNAME}:${PASSWORD}`);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    Authorization: `Basic ${basicToken}`,
    Accept: "application/json",
  },
});
