"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchAvgPrice,
  fetchAvgPricePerArea,
  fetchCollectedPeriods,
  fetchTradingVolume,
  fetchAvgPriceChange,
  fetchAvgPriceByBuildAge,
} from "@/lib/api/stats";
import type { StatType } from "@/lib/types/stats";
import { SummaryCards } from "@/components/stats/SummaryCards";
import { UserPriceBarChart } from "@/components/charts/UserPriceBarChart";
import { PriceChangeZeroBaselineSection } from "@/components/charts/PriceChangeZeroBaselineSection";
import { AvgPriceTable } from "@/components/stats/AvgPriceTable";
import { RegionBuildAgeCard } from "@/components/stats/RegionBuildAgeCard";

import { formatKoreanPrice } from "@/lib/utils/priceFormatter";

type RankType = "TOP" | "BOTTOM";
type ChangeSortType = "UP" | "DOWN";

type BuildAgeSortKey = "NEW" | "SEMI_NEW" | "OLD";
type BuildAgeRankType = "TOP" | "BOTTOM";

type CollectedPeriod = {
  statYear: number;
  statHalf: "H1" | "H2";
};

type PriceChangeRow = {
  region: string;
  changeRate: number;
};

export default function ApartmentStatsPage() {
  const [periods, setPeriods] = useState<CollectedPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<CollectedPeriod | null>(
    null
  );

  const [statType, setStatType] = useState<StatType>("AVG_PRICE");
  const [rankType, setRankType] = useState<RankType>("TOP");
  const [volumeRankType, setVolumeRankType] = useState<"TOP" | "BOTTOM">("TOP");
  const [changeSortType, setChangeSortType] = useState<ChangeSortType>("UP");

  const [avgPriceData, setAvgPriceData] = useState<any[]>([]);
  const [avgPricePerAreaData, setAvgPricePerAreaData] = useState<any[]>([]);

  const [tradingVolumeData, setTradingVolumeData] = useState<any[]>([]);
  const [priceChangeData, setPriceChangeData] = useState<any[]>([]);
  const [priceChangeError, setPriceChangeError] = useState<string | null>(null);
  const [buildAgeData, setBuildAgeData] = useState<any[]>([]);

  const [buildAgeSortKey, setBuildAgeSortKey] =
    useState<BuildAgeSortKey>("NEW");
  const [buildAgeRankType, setBuildAgeRankType] = useState<RankType>("TOP");

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

    const [avgRes, perAreaRes, volumeRes, changeRes, buildAgeRes] =
      await Promise.all([
        fetchAvgPrice(selectedPeriod.statYear, selectedPeriod.statHalf),
        fetchAvgPricePerArea(selectedPeriod.statYear, selectedPeriod.statHalf),
        fetchTradingVolume(selectedPeriod.statYear, selectedPeriod.statHalf),
        fetchAvgPriceChange(selectedPeriod.statYear, selectedPeriod.statHalf),
        fetchAvgPriceByBuildAge(
          selectedPeriod.statYear,
          selectedPeriod.statHalf
        ),
      ]);

    if (!avgRes.error) setAvgPriceData(avgRes.data);
    if (!perAreaRes.error) setAvgPricePerAreaData(perAreaRes.data);
    if (!volumeRes.error) setTradingVolumeData(volumeRes.data);

    if (changeRes.error) {
      setPriceChangeData([]);
      setPriceChangeError(changeRes.error.message);
    } else {
      setPriceChangeData(changeRes.data);
    }

    if (!buildAgeRes.error) setBuildAgeData(buildAgeRes.data);

    setLoading(false);
  };

  const baseData =
    statType === "AVG_PRICE" ? avgPriceData : avgPricePerAreaData;

  //상위 하위 데이터
  const sortedPriceData = useMemo(() => {
    if (baseData.length === 0) return [];

    return [...baseData].sort((a, b) => {
      const av = statType === "AVG_PRICE" ? a.avgPrice : a.avgPricePerArea;
      const bv = statType === "AVG_PRICE" ? b.avgPrice : b.avgPricePerArea;

      return rankType === "TOP" ? bv - av : av - bv;
    });
  }, [baseData, statType, rankType]);

  //차트용 슬라이스(10)
  const chartData = useMemo(() => {
    return sortedPriceData.slice(0, 10).map((row) => ({
      region: row.region,
      value: statType === "AVG_PRICE" ? row.avgPrice : row.avgPricePerArea,
    }));
  }, [sortedPriceData, statType]);

  const summary = useMemo(() => {
    if (chartData.length === 0) return null;

    const values = chartData.map((d) => d.value);

    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }, [chartData]);

  //거래량 공통 데이터
  const sortedVolumeData = useMemo(() => {
    return [...tradingVolumeData].sort((a, b) =>
      volumeRankType === "TOP" ? b.count - a.count : a.count - b.count
    );
  }, [tradingVolumeData, volumeRankType]);

  //차트용 슬라이스(10)
  const volumeChartData = useMemo(() => {
    return sortedVolumeData.slice(0, 10).map((d) => ({
      region: d.region,
      value: d.count,
    }));
  }, [sortedVolumeData]);

  //신구축 정렬
  const sortedBuildAgeCards = useMemo(() => {
    const getValue = (row: any) => {
      if (buildAgeSortKey === "NEW") return row.newAvgPrice;
      if (buildAgeSortKey === "SEMI_NEW") return row.semiNewAvgPrice;
      return row.oldAvgPrice;
    };

    return [...buildAgeData].sort((a, b) => {
      const diff = getValue(b) - getValue(a);
      return buildAgeRankType === "TOP" ? diff : -diff;
    });
  }, [buildAgeData, buildAgeSortKey, buildAgeRankType]);

  return (
    <div className="w-full bg-slate-50">
      <div className="mx-auto max-w-[1460px] px-6 py-10 space-y-8">
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
        {/* ===== 요약 카드 ===== */}
        {summary && <SummaryCards summary={summary} />}
        <div className="grid grid-cols-[3fr_1.5fr] gap-6">
          {/* ==== 1-1 차트 ==== */}
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

          {/* ==== 1-2 테이블 ==== */}
          <AvgPriceTable
            statType={statType}
            data={sortedPriceData.map((row, idx) => ({
              rank: idx + 1,
              region: row.region,
              value:
                statType === "AVG_PRICE" ? row.avgPrice : row.avgPricePerArea,
            }))}
          />
        </div>
        {/* ===== 2 거래량 ===== */}
        <div className="inline-flex rounded-lg border overflow-hidden mb-4">
          <button
            className={`px-4 py-2 text-sm ${
              volumeRankType === "TOP" ? "bg-slate-800 text-white" : "bg-white"
            }`}
            onClick={() => setVolumeRankType("TOP")}
          >
            상위 10
          </button>
          <button
            className={`px-4 py-2 text-sm ${
              volumeRankType === "BOTTOM"
                ? "bg-slate-800 text-white"
                : "bg-white"
            }`}
            onClick={() => setVolumeRankType("BOTTOM")}
          >
            하위 10
          </button>
        </div>
        <div className="grid grid-cols-[3fr_1.5fr] gap-6">
          {/* ===== 2-1 차트 ===== */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">지역별 거래량</h2>

            {volumeChartData.length === 0 ? (
              <div className="text-gray-400">데이터 없음</div>
            ) : (
              <UserPriceBarChart
                data={volumeChartData}
                valueFormatter={(v) => `${v.toLocaleString()}건`}
              />
            )}
          </div>

          {/* ===== 2-2 테이블 ===== */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">지역별 거래량 순위</h2>

            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-2">순위</th>
                    <th className="text-left">지역</th>
                    <th className="text-right">거래량</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVolumeData.map((d, idx) => (
                    <tr key={d.region} className="border-b last:border-0">
                      <td className="py-2">{idx + 1}</td>
                      <td>{d.region}</td>
                      <td className="text-right">
                        {d.count.toLocaleString()}건
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* ===== 3 평균가 증감률 ===== */}
        <div className="inline-flex rounded-lg border mb-4 overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${
              changeSortType === "UP"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setChangeSortType("UP")}
          >
            상승률 순
          </button>

          <button
            className={`px-4 py-2 text-sm ${
              changeSortType === "DOWN"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setChangeSortType("DOWN")}
          >
            하락률 순
          </button>
        </div>
        {priceChangeData.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 flex items-center justify-center h-[420px] text-slate-500">
            전기 데이터가 없습니다
          </div>
        ) : (
          <PriceChangeZeroBaselineSection
            data={priceChangeData}
            sortType={changeSortType}
          />
        )}
        {/* ===== 4 지역별 신축 준신축 구축 평균가 ===== */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-6">
            지역별 신축 / 준신축 / 구축 평균가
          </h2>

          <div className="flex items-center justify-between gap-4 mb-6">
            {/* ==== 신축 준신축 구축 ==== */}
            <div className="inline-flex rounded-lg border bg-white overflow-hidden">
              {(
                [
                  ["NEW", "신축"],
                  ["SEMI_NEW", "준신축"],
                  ["OLD", "구축"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBuildAgeSortKey(key)}
                  className={`px-4 py-2 text-sm font-medium transition
          ${
            buildAgeSortKey === key
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50"
          }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ==== 상위 하위 ==== */}
            <div className="inline-flex rounded-lg border bg-white overflow-hidden">
              {(
                [
                  ["TOP", "상위"],
                  ["BOTTOM", "하위"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBuildAgeRankType(key)}
                  className={`px-4 py-2 text-sm font-medium transition
          ${
            buildAgeRankType === key
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50"
          }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[620px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedBuildAgeCards.map((d) => (
                <RegionBuildAgeCard
                  key={d.region}
                  region={d.region}
                  newPrice={d.newAvgPrice}
                  semiNewPrice={d.semiNewAvgPrice}
                  oldPrice={d.oldAvgPrice}
                  buildAgeType={buildAgeSortKey}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
