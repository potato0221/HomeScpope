"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchAvgPrice,
  fetchAvgPricePerArea,
  fetchCollectedPeriods,
} from "@/lib/api/stats";
import type { StatType } from "@/lib/types/stats";
import { SummaryCards } from "@/components/stats/SummaryCards";
import { UserPriceBarChart } from "@/components/charts/UserPriceBarChart";

type RankType = "TOP" | "BOTTOM";

type CollectedPeriod = {
  statYear: number;
  statHalf: "H1" | "H2";
};

export default function ApartmentStatsPage() {
  const [periods, setPeriods] = useState<CollectedPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<CollectedPeriod | null>(
    null
  );

  const [statType, setStatType] = useState<StatType>("AVG_PRICE");
  const [rankType, setRankType] = useState<RankType>("TOP");

  const [avgPriceData, setAvgPriceData] = useState<any[]>([]);
  const [avgPricePerAreaData, setAvgPricePerAreaData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  //수집기간 불러오기
  useEffect(() => {
    const loadPeriods = async () => {
      const { data } = await fetchCollectedPeriods();
      if (data && data.length > 0) {
        setPeriods(data);
        setSelectedPeriod(data[0]);
      }
    };

    loadPeriods();
  }, []);

  //조회버튼
  const handleFetch = async () => {
    if (!selectedPeriod) return;

    setLoading(true);

    const [avgRes, perAreaRes] = await Promise.all([
      fetchAvgPrice(selectedPeriod.statYear, selectedPeriod.statHalf),
      fetchAvgPricePerArea(selectedPeriod.statYear, selectedPeriod.statHalf),
    ]);

    if (!avgRes.error) setAvgPriceData(avgRes.data);
    if (!perAreaRes.error) setAvgPricePerAreaData(perAreaRes.data);

    setLoading(false);
  };

  const baseData =
    statType === "AVG_PRICE" ? avgPriceData : avgPricePerAreaData;

  //상위 하위 데이터
  const chartData = useMemo(() => {
    if (baseData.length === 0) return [];

    const sorted = [...baseData].sort((a, b) => {
      const av = statType === "AVG_PRICE" ? a.avgPrice : a.avgPricePerArea;
      const bv = statType === "AVG_PRICE" ? b.avgPrice : b.avgPricePerArea;
      return rankType === "TOP" ? bv - av : av - bv;
    });

    return sorted.slice(0, 10).map((row) => ({
      region: row.region,
      value: statType === "AVG_PRICE" ? row.avgPrice : row.avgPricePerArea,
    }));
  }, [baseData, statType, rankType]);

  const summary = useMemo(() => {
    if (chartData.length === 0) return null;

    const values = chartData.map((d) => d.value);

    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }, [chartData]);

  return (
    <div className="w-full bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* ===== 기간 선택 ===== */}
          <select
            className="border rounded px-3 py-2"
            value={
              selectedPeriod
                ? `${selectedPeriod.statYear}-${selectedPeriod.statHalf}`
                : ""
            }
            onChange={(e) => {
              const [year, half] = e.target.value.split("-");
              setSelectedPeriod({
                statYear: Number(year),
                statHalf: half as "H1" | "H2",
              });
            }}
          >
            {periods.map((p) => (
              <option
                key={`${p.statYear}-${p.statHalf}`}
                value={`${p.statYear}-${p.statHalf}`}
              >
                {p.statYear}년 {p.statHalf === "H1" ? "상반기" : "하반기"}
              </option>
            ))}
          </select>
          <button
            onClick={handleFetch}
            className="px-4 py-2 bg-black text-white rounded"
          >
            통계 조회
          </button>
        </div>
        {/* ===== 평균가 평당가 ===== */}
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
        {/* ===== 상위 하위 ===== */}
        <div className="inline-flex rounded-lg border mx-2 overflow-hidden">
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
        {summary && <SummaryCards summary={summary} />}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">
            {rankType === "TOP" ? "상위" : "하위"} 10개 지역{" "}
            {statType === "AVG_PRICE" ? "평균 거래가" : "평당가"}
          </h2>

          {loading ? (
            <div className="text-gray-500">통계 불러오는 중...</div>
          ) : chartData.length === 0 ? (
            <div className="text-gray-400">조회된 데이터가 없습니다.</div>
          ) : (
            <UserPriceBarChart data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
}
