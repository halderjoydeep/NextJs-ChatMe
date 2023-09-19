import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
// import

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function chatIdConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function formatTimestamp(timestamp: number) {
  return format(timestamp, "HH:mm");
}

export function toPusherChannel(channel: string) {
  return channel.replace(/:/g, "__");
}
