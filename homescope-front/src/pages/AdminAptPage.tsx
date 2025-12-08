import { Button } from "@/components/ui/button";
import { client } from "../lib/api/client";
import type { paths } from "../lib/types/api/v1/schema";
import React, { useState } from "react";

export default function AdminAptFetcher() {
  const [loading, setLoading] = useState(false);

  const handleAddArea = async () => {
    setLoading(true);

    const { data, error } = await client.POST("/api/v1/area/add");

    setLoading(false);

    if (error) {
      alert("오류 발생: " + error.message);
      return;
    }

    alert("지역 등록 성공!");
  };

  return (
    <div>
      <h1>관리자 페이지</h1>
      <button className="mb-2" onClick={handleAddArea} disabled={loading}>
        {loading ? "저장 중..." : "지역코드 저장"}
      </button>
    </div>
  );
}
