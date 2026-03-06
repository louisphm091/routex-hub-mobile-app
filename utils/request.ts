import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const genUUID = () => uuidv4();

export const nowOffsetDateTime = () => {
  const now = new Date();

  const pad = (n: number) => String(n).padStart(2, "0");

  const tz = -now.getTimezoneOffset();
  const sign = tz >= 0 ? "+" : "-";
  const hh = pad(Math.floor(Math.abs(tz) / 60));
  const mm = pad(Math.abs(tz) % 60);

  const offset = `${sign}${hh}:${mm}`;

  return (
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    "T" +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes()) +
    ":" +
    pad(now.getSeconds()) +
    "." +
    String(now.getMilliseconds()).padStart(3, "0") +
    offset
  );
};
