"use client";

import { useState, useMemo } from "react";
import { fetchAvgPriceByRegion } from "@/lib/api/stats";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function AdminStatsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    const result = await fetchAvgPriceByRegion();
    setData(result);
    setPage(1); // 조회 시 페이지 초기화
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    return data
      .filter((row) => row.region.toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => b.avgPrice - a.avgPrice);
  }, [data, keyword]);

  const pagedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">지역별 평균 아파트 거래가</h1>

      <Button className="mr-2" onClick={handleFetch} disabled={loading}>
        {loading ? "조회 중..." : "통계 조회"}
      </Button>

      {data.length > 0 && (
        <input
          type="text"
          placeholder="지역명 검색 (예 : 서울)"
          className="border p-2 w-64"
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
                    {(row.avgPrice / 100_000_000).toFixed(1)}억
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
