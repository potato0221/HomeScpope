import { client } from "./client";

export function addArea() {
  return client.POST("/api/v1/area/add");
}

export function fetchApt(collectedYear: number, collectedHalf: string) {
  return client.GET("/api/v1/apt/add", {
    params: {
      query: { collectedYear, collectedHalf },
    },
  });
}
