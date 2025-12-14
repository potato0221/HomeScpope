export interface AvgPriceByRegion {
  region: string;
  avgPrice: number;
}

export interface RsData<T> {
  resultCode: string;
  msg: string;
  data: T;
}
