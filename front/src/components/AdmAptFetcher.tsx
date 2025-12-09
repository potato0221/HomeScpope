"use client";

import { useState } from "react";
import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

export default function AdminAptFetcher() {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("2025");
  const [half, setHalf] = useState("firstHalf");

  const handleAddArea = async () => {
    setLoading(true);

    const { data, error } = await client.POST("/api/v1/area/add");

    setLoading(false);

    if (error !== undefined) {
      alert("오류 발생: " + error);
      return;
    }

    alert("지역코드 저장 완료!");
  };

  const handleFetchApt = async () => {
    setLoading(true);

    const { data, error } = await client.GET("/api/v1/apt/add", {
      params: {
        query: {
          year: Number(year),
          half,
        },
      },
    });

    setLoading(false);

    if (error !== undefined) {
      alert("오류 발생: " + error);
      return;
    }

    alert("전국 아파트 데이터 수집 완료!");
  };

  return (
    <div className="space-y-6">
      {/* 지역 코드 저장 */}
      <div>
        <Button onClick={handleAddArea} disabled={loading}>
          {loading ? "저장 중..." : "지역코드 저장"}
        </Button>
      </div>

      {/* 년도 선택 */}
      <div>
        <label className="mr-2">년도:</label>
        <select
          className="border p-2"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* 분기 선택 */}
      <div>
        <label className="mr-2">분기:</label>
        <select
          className="border p-2"
          value={half}
          onChange={(e) => setHalf(e.target.value)}
        >
          <option value="firstHalf">상반기</option>
          <option value="secondHalf">하반기</option>
        </select>
      </div>

      {/* 전국 데이터 수집 */}
      <Button onClick={handleFetchApt} disabled={loading}>
        {loading ? "불러오는 중..." : "전국 데이터 불러오기"}
      </Button>
    </div>
  );
}
