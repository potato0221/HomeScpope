"use client";

import { formatKoreanPrice } from "@/lib/utils/priceFormatter";

type Summary = {
  avg: number;
  max: number;
  min: number;
};

export function SummaryCards({ summary }: { summary: Summary }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <div className="text-sm text-gray-500">수도권 평균</div>
        <div className="text-xl font-bold">
          {formatKoreanPrice(summary.avg)}
        </div>
      </div>

      <div className="p-4 border rounded">
        <div className="text-sm text-gray-500">최고 지역</div>
        <div className="text-xl font-bold">
          {formatKoreanPrice(summary.max)}
        </div>
      </div>

      <div className="p-4 border rounded">
        <div className="text-sm text-gray-500">최저 지역</div>
        <div className="text-xl font-bold">
          {formatKoreanPrice(summary.min)}
        </div>
      </div>
    </div>
  );
}
