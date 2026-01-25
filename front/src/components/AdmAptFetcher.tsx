"use client";

import { useState } from "react";
import { addArea, fetchApt } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

export default function AdminAptFetcher() {
  const [loading, setLoading] = useState(false);
  const [collectedYear, setYear] = useState("2025");
  const [collectedHalf, setHalf] = useState<"H1" | "H2">("H1");
  const [propertyType, setType] = useState("APT");

  const handleAddArea = async () => {
    setLoading(true);

    const { data, error } = await addArea();

    setLoading(false);

    if (error) {
      alert(error.msg);
      return;
    }

    alert("지역코드 저장 완료!");
  };

  const handleFetchApt = async () => {
    setLoading(true);

    const { data, error } = await fetchApt(
      Number(collectedYear),
      collectedHalf,
      propertyType,
    );

    setLoading(false);

    if (error) {
      alert(error.msg);
      return;
    }

    alert("수도권 아파트 데이터 수집 완료!");
  };

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={handleAddArea} disabled={loading}>
          {loading ? "저장 중..." : "지역코드 저장"}
        </Button>
      </div>

      <div>
        <label className="mr-2">년도:</label>
        <select
          className="border p-2"
          value={collectedYear}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div>
        <label className="mr-2">분기:</label>
        <select
          className="border p-2"
          value={collectedHalf}
          onChange={(e) => setHalf(e.target.value as "H1" | "H2")}
        >
          <option value="H1">상반기</option>
          <option value="H2">하반기</option>
        </select>
      </div>

      <div>
        <label className="mr-2">분기:</label>
        <select
          className="border p-2"
          value={propertyType}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="APT">아파트</option>
          <option value="VILLA">연립/다세대</option>
          <option value="HOUSE">단독/다가구</option>
          <option value="OFFICETEL">오피스텔</option>
        </select>
      </div>

      <Button onClick={handleFetchApt} disabled={loading}>
        {loading ? "불러오는 중..." : "수도권 데이터 불러오기"}
      </Button>
    </div>
  );
}
