import { client } from "@/lib/api/client";

//수집된 반기 리스트
export async function fetchCollectedPeriods() {
  const { data, error } = await client.GET("/api/v1/deal/collected/list", {
    params: {},
  });

  if (error) {
    return { data: null, error };
  }

  return { data: data.data, error: null };
}

//지역별 평균가
export async function fetchAvgPrice(statYear: number, statHalf: "H1" | "H2") {
  const { data, error } = await client.GET("/api/v1/stats/avg-price", {
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

//지역별 평당가
export async function fetchAvgPricePerArea(
  statYear: number,
  statHalf: "H1" | "H2",
) {
  const { data, error } = await client.GET("/api/v1/stats/avg-price/per-area", {
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

//지역별 거래량
export async function fetchTradingVolume(
  statYear: number,
  statHalf: "H1" | "H2",
) {
  const { data, error } = await client.GET("/api/v1/stats/trading-volume", {
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

//지역별 평균가 증감률
export async function fetchAvgPriceChange(
  currYear: number,
  currHalf: "H1" | "H2",
) {
  const { data, error } = await client.GET("/api/v1/stats/avg-price/change", {
    params: {
      query: {
        currYear,
        currHalf,
      },
    },
  });

  if (error) {
    return { data: null, error };
  }

  return { data: data.data, error: null };
}

//지역별 신축/준신축/구축 평균가
export async function fetchAvgPriceByBuildAge(
  statYear: number,
  statHalf: "H1" | "H2",
) {
  const { data, error } = await client.GET(
    "/api/v1/stats/avg-price/build-age",
    {
      params: {
        query: {
          statYear,
          statHalf,
        },
      },
    },
  );

  if (error) {
    return { data: null, error };
  }

  return { data: data.data, error: null };
}
