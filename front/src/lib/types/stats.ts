export interface AvgPriceByRegion {
  region: string;
  avgPrice: number;
}

export interface RsData<T> {
  resultCode: string;
  msg: string;
  data: T;
}

export type StatType = "AVG_PRICE" | "AVG_PRICE_PER_AREA";
