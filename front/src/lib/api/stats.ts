import { client } from "@/lib/api/client";

export async function fetchCollectedPeriods() {
  const { data, error } = await client.GET("/api/v1/apt/collected/list", {
    params: {},
  });

  if (error) {
    return { data: null, error };
  }

  return { data: data.data, error: null };
}

export async function fetchAvgPriceByRegion(
  statYear: number,
  statHalf: "H1" | "H2"
) {
  const { data, error } = await client.GET("/api/v1/stats/avg-price/region", {
    params: {
      query: {
        statYear,
        statHalf,
      },
    },
  });

  if (error) {
    return { data: null, error };
  }

  return { data: data.data, error: null };
}
