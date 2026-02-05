import { client } from "./client";

export function addArea() {
  return client.POST("/api/v1/area/admin/add");
}

export function fetchApt(
  collectedYear: number,
  collectedHalf: string,
  propertyType: string,
) {
  return client.POST("/api/v1/deal/admin/add", {
    params: {
      query: { collectedYear, collectedHalf, propertyType },
    },
  });
}
