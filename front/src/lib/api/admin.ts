import { client } from "./client";

export function addArea() {
  return client.POST("/api/v1/area/add");
}

export function fetchApt(
  collectedYear: number,
  collectedHalf: string,
  propertyType: string,
) {
  return client.GET("/api/v1/deal/add", {
    params: {
      query: { collectedYear, collectedHalf, propertyType },
    },
  });
}
