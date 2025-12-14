import { client } from "@/lib/api/client";
import type { AvgPriceByRegion, RsData } from "../types/stats";

export async function fetchAvgPriceByRegion() {
  const { data, error } = await client.GET("/api/v1/stats/avg-price/region");

  if (error) {
    throw error;
  }

  return data.data; // RsData 언랩
}
