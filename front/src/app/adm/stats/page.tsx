"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchAvgPrice,
  fetchAvgPricePerArea,
  fetchCollectedPeriods,
} from "@/lib/api/stats";
import { Button } from "@/components/ui/button";
import type { StatType } from "@/lib/types/stats";
import { formatKoreanPrice } from "@/lib/utils/priceFormatter";

const PAGE_SIZE = 10;

type CollectedPeriod = {
  statYear: number;
  statHalf: "H1" | "H2";
};

export default function AdmAptStatsPage() {
  const [periods, setPeriods] = useState<CollectedPeriod[]>([]);
  const [statType, setStatType] = useState<StatType>("AVG_PRICE");
  const [selectedPeriod, setSelectedPeriod] = useState<CollectedPeriod | null>(
    null
  );

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchCollectedPeriods();

      if (error) {
        alert(error.msg);
        return;
      }

      setPeriods(data);
    })();
  }, []);

  const handleFetch = async () => {
    if (!selectedPeriod) {
      alert("기간을 선택하세요");
      return;
    }

    setLoading(true);

    let result;

    if (statType === "AVG_PRICE") {
      result = await fetchAvgPrice(
        selectedPeriod.statYear,
        selectedPeriod.statHalf
      );
    } else {
      result = await fetchAvgPricePerArea(
        selectedPeriod.statYear,
        selectedPeriod.statHalf
      );
    }

    setLoading(false);

    if (result.error) {
      alert(result.error.msg);
      return;
    }

    console.log("API DATA:", result.data); // ⭐ 여기 꼭 찍어라

    setData(result.data);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return data
      .filter((row) => row.region.toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => {
        if (statType === "AVG_PRICE") {
          return b.avgPrice - a.avgPrice;
        }
        return b.avgPricePerArea - a.avgPricePerArea;
      });
  }, [data, keyword, statType]);

  const pagedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">지역별 평균 아파트 거래가</h1>

      {periods.length > 0 && (
        <select
          className="border p-2 w-64 mr-2"
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
          <option value="">수집된 기간 선택</option>
          {periods.map((p) => (
            <option
              key={`${p.statYear}-${p.statHalf}`}
              value={`${p.statYear}-${p.statHalf}`}
            >
              {p.statYear}년 {p.statHalf === "H1" ? "상반기" : "하반기"}
            </option>
          ))}
        </select>
      )}

      <select
        className="border p-2 w-64 mr-2"
        value={statType}
        onChange={(e) => setStatType(e.target.value as StatType)}
      >
        <option value="AVG_PRICE">지역별 평균 거래가</option>
        <option value="AVG_PRICE_PER_AREA">지역별 평당가</option>
      </select>

      <Button onClick={handleFetch} disabled={loading}>
        {loading ? "조회 중..." : "통계 조회"}
      </Button>

      {data.length > 0 && (
        <input
          type="text"
          placeholder="지역명 검색 (예 : 서울)"
          className="border p-2 w-64 ml-2"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
        />
      )}

      {pagedData.length > 0 && (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">지역</th>
                <th className="border p-2">평균 거래가</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((row) => (
                <tr key={row.region}>
                  <td className="border p-2">{row.region}</td>
                  <td className="border p-2">
                    {statType === "AVG_PRICE"
                      ? formatKoreanPrice(row.avgPrice)
                      : formatKoreanPrice(row.avgPricePerArea)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
