"use client";

import { useMemo, useState } from "react";
import { SummaryCards } from "@/components/lists/SummaryCards";
import { UserPriceBarChart } from "@/components/charts/UserPriceBarChart";
import { AvgPriceTable } from "@/components/lists/AvgPriceTable";

type StatType = "AVG_PRICE" | "AVG_PRICE_PER_AREA";
type RankType = "TOP" | "BOTTOM";

type DataItem = {
  region: string;
  avgPrice: number;
  avgPricePerArea: number;
};

export default function AvgPriceSection({
  avgPriceData,
  avgPricePerAreaData,
}: {
  avgPriceData: DataItem[];
  avgPricePerAreaData: DataItem[];
}) {
  const [statType, setStatType] = useState<StatType>("AVG_PRICE");
  const [rankType, setRankType] = useState<RankType>("TOP");

  const baseData =
    statType === "AVG_PRICE" ? avgPriceData : avgPricePerAreaData;

  const getValue = (d: DataItem) =>
    statType === "AVG_PRICE" ? d.avgPrice : d.avgPricePerArea;

  //정렬
  const sortedPriceData = useMemo(() => {
    return [...baseData].sort((a, b) =>
      rankType === "TOP"
        ? getValue(b) - getValue(a)
        : getValue(a) - getValue(b),
    );
  }, [baseData, statType, rankType]);

  //차트용 슬라이스(10)
  const chartData = useMemo(() => {
    return sortedPriceData.slice(0, 10).map((r) => ({
      region: r.region,
      value: getValue(r),
    }));
  }, [sortedPriceData, statType]);

  //전체 요약 데이터
  const summary = useMemo(() => {
    if (!baseData.length) return null;

    const values = baseData.map(getValue);

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }, [baseData, statType]);

  return (
    <div>
      {/* ===== 평균가 / 평당가 선택 ===== */}
      <div className="inline-flex rounded-lg border overflow-hidden">
        <button
          className={`px-4 py-2 text-sm ${
            statType === "AVG_PRICE"
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setStatType("AVG_PRICE")}
        >
          평균 거래가
        </button>

        <button
          className={`px-4 py-2 text-sm ${
            statType === "AVG_PRICE_PER_AREA"
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setStatType("AVG_PRICE_PER_AREA")}
        >
          평당가
        </button>
      </div>

      {/* ===== 상위 / 하위 ===== */}
      <div className="inline-flex rounded-lg border mx-2 overflow-hidden mb-4">
        <button
          className={`px-4 py-2 text-sm ${
            rankType === "TOP"
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRankType("TOP")}
        >
          상위 10
        </button>

        <button
          className={`px-4 py-2 text-sm ${
            rankType === "BOTTOM"
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRankType("BOTTOM")}
        >
          하위 10
        </button>
      </div>

      {/* ===== 요약 ===== */}
      {summary && <SummaryCards summary={summary} />}

      {/* ===== 차트 ===== */}
      <div className="grid grid-cols-[3fr_1.5fr] gap-6 mt-4">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">
            {rankType === "TOP" ? "상위" : "하위"} 10개 지역{" "}
            {statType === "AVG_PRICE" ? "평균 거래가" : "평당가"}
          </h2>

          {chartData.length === 0 ? (
            <div className="text-gray-400">조회된 데이터가 없습니다.</div>
          ) : (
            <UserPriceBarChart data={chartData} />
          )}
        </div>
        {/* ===== 테이블 ===== */}
        <AvgPriceTable
          statType={statType}
          data={sortedPriceData.map((d, idx) => ({
            rank: idx + 1,
            region: d.region,
            value: getValue(d),
          }))}
        />
      </div>
    </div>
  );
}
