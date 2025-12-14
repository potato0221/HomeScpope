"use client";

import { useState } from "react";
import { fetchAvgPriceByRegion } from "@/lib/api/stats";
import { Button } from "@/components/ui/button";

export default function AdminStatsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    const result = await fetchAvgPriceByRegion();
    setData(result);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">지역별 평균 아파트 거래가</h1>

      <Button onClick={handleFetch} disabled={loading}>
        {loading ? "조회 중..." : "통계 조회"}
      </Button>

      {data.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">지역</th>
              <th className="border p-2">평균 거래가</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.region}>
                <td className="border p-2">{row.region}</td>
                <td className="border p-2">
                  {(row.avgPrice / 100_000_000).toFixed(1)}억
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
