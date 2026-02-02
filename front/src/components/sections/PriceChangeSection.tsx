import { useMemo, useState } from "react";
import { PriceChangeChart } from "@/components/charts/PriceChangeChart";
import { PriceChangeList } from "@/components/lists/PriceChangeList";

interface DataItem {
  region: string;
  changeRate: number;
}

export default function PriceChangeSection({ data }: { data: DataItem[] }) {
  const [sortType, setSortType] = useState<"UP" | "DOWN">("UP");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) =>
      sortType === "UP"
        ? b.changeRate - a.changeRate
        : a.changeRate - b.changeRate,
    );
  }, [data, sortType]);

  return (
    <div>
      {/* ===== 정렬 버튼 ===== */}
      <div className="inline-flex rounded-lg border mb-4 overflow-hidden">
        <button
          className={`px-4 py-2 text-sm ${
            sortType === "UP"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setSortType("UP")}
        >
          상승률 순
        </button>

        <button
          className={`px-4 py-2 text-sm ${
            sortType === "DOWN"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setSortType("DOWN")}
        >
          하락률 순
        </button>
      </div>

      {/* ===== 차트 / 리스트 ===== */}
      <div className="grid grid-cols-[3fr_1.5fr] gap-6">
        <PriceChangeChart data={sorted.slice(0, 10)} />
        <PriceChangeList data={sorted} sortType={sortType} />
      </div>
    </div>
  );
}
