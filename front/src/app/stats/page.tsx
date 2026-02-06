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
import AvgPriceSection from "@/components/sections/AvgPriceSection";
import PriceChangeSection from "@/components/sections/PriceChangeSection";
import RegionBuildAgeSection from "@/components/sections/RegionBuildAgeSection";
import VolumeSection from "@/components/sections/VolumeSection";

type PropertyType = "APT" | "VILLA" | "HOUSE" | "OFFICETEL";

type CollectedPeriod = {
  statYear: number;
  statHalf: "H1" | "H2";
};

export default function StatsPage() {
  const [periods, setPeriods] = useState<CollectedPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<CollectedPeriod | null>(
    null,
  );
  const [propertyType, setPropertyType] = useState<PropertyType>("APT");
  const [titlePropertyType, setTitlePropertyType] =
    useState<PropertyType>("APT");
  const [titlePeriod, setTitlePeriod] = useState<CollectedPeriod | null>(null);
  const [avgPriceData, setAvgPriceData] = useState<any[]>([]);
  const [avgPricePerAreaData, setAvgPricePerAreaData] = useState<any[]>([]);
  const [tradingVolumeData, setTradingVolumeData] = useState<any[]>([]);
  const [priceChangeData, setPriceChangeData] = useState<any[]>([]);
  const [priceChangeError, setPriceChangeError] = useState<string | null>(null);
  const [buildAgeData, setBuildAgeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  //년도,반기 중복 제거
  const uniquePeriods = useMemo(() => {
    const map = new Map<string, CollectedPeriod>();

    periods.forEach((p) => {
      const key = `${p.statYear}-${p.statHalf}`;
      if (!map.has(key)) {
        map.set(key, p);
      }
    });

    return Array.from(map.values());
  }, [periods]);

  //propertyType 라벨
  const PROPERTY_LABEL = {
    APT: "아파트",
    VILLA: "연립/다세대",
    HOUSE: "단독/다가구",
    OFFICETEL: "오피스텔",
  };

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

    setTitlePeriod(selectedPeriod);
    setTitlePropertyType(propertyType);

    const [avgRes, perAreaRes, volumeRes, changeRes, buildAgeRes] =
      await Promise.all([
        fetchAvgPrice(
          selectedPeriod.statYear,
          selectedPeriod.statHalf,
          propertyType,
        ),
        fetchAvgPricePerArea(
          selectedPeriod.statYear,
          selectedPeriod.statHalf,
          propertyType,
        ),
        fetchTradingVolume(
          selectedPeriod.statYear,
          selectedPeriod.statHalf,
          propertyType,
        ),
        fetchAvgPriceChange(
          selectedPeriod.statYear,
          selectedPeriod.statHalf,
          propertyType,
        ),
        fetchAvgPriceByBuildAge(
          selectedPeriod.statYear,
          selectedPeriod.statHalf,
          propertyType,
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
            {uniquePeriods.map((p) => (
              <option
                key={`${p.statYear}-${p.statHalf}`}
                value={`${p.statYear}-${p.statHalf}`}
              >
                {p.statYear}년 {p.statHalf === "H1" ? "상반기" : "하반기"}
              </option>
            ))}
          </select>
          {/* ===== 거주 유형 선택 ===== */}
          <select
            className="border rounded px-3 py-2"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
          >
            <option value="APT">아파트</option>
            <option value="VILLA">연립/다세대</option>
            <option value="HOUSE">단독/다가구</option>
            <option value="OFFICETEL">오피스텔</option>
          </select>
          <button
            onClick={handleFetch}
            className="px-4 py-2 bg-black text-white rounded"
          >
            통계 조회
          </button>
        </div>
        <input
          className="border rounded px-3 py-2"
          placeholder="지역명 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {/* ===== 년도 / 가구 유형 ===== */}
        {titlePeriod && (
          <div className="bg-slate-50 border rounded-xl p-4 mb-6 w-fit">
            <div className="text-xl font-bold mt-1">
              {titlePeriod.statYear}년{" "}
              {titlePeriod.statHalf === "H1" ? "상반기" : "하반기"} ·{" "}
              {PROPERTY_LABEL[titlePropertyType]}
            </div>
          </div>
        )}

        {/* ===== 1 평균가 / 평당가 ===== */}
        <AvgPriceSection
          avgPriceData={avgPriceData}
          avgPricePerAreaData={avgPricePerAreaData}
          keyword={keyword}
        />

        {/* ===== 2 거래량 ===== */}
        <VolumeSection rows={tradingVolumeData} keyword={keyword} />

        {/* ===== 3 평균가 증감률 ===== */}
        <PriceChangeSection rows={priceChangeData} keyword={keyword} />

        {/* ===== 4 지역별 신축 준신축 구축 평균가 ===== */}
        <RegionBuildAgeSection rows={buildAgeData} keyword={keyword} />
      </div>
    </div>
  );
}
