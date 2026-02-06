import { useMemo, useState } from "react";
import { PriceChangeChart } from "@/components/charts/PriceChangeChart";
import { PriceChangeList } from "@/components/lists/PriceChangeList";

interface DataItem {
  region: string;
  changeRate: number;
}

interface Props {
  rows: DataItem[];
  keyword: string;
}

export default function PriceChangeSection({ rows, keyword }: Props) {
  const [rankType, setRankType] = useState<"UP" | "DOWN">("UP");

  const rankedChangePrice = useMemo(() => {
    return [...rows]
      .sort((a, b) =>
        rankType === "UP"
          ? b.changeRate - a.changeRate
          : a.changeRate - b.changeRate,
      )
      .map((row, idx) => ({
        ...row,
        rank: idx + 1,
      }));
  }, [rows, rankType]);

  const filteredRankedChangePrice = useMemo(() => {
    if (!keyword) return rankedChangePrice;

    return rankedChangePrice.filter((r) => r.region.includes(keyword));
  }, [rankedChangePrice, keyword]);

  return (
    <div>
      {/* ===== 정렬 버튼 ===== */}
      <div className="inline-flex rounded-lg border mb-4 overflow-hidden">
        <button
          className={`px-4 py-2 text-sm ${
            rankType === "UP"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRankType("UP")}
        >
          상승률 순
        </button>

        <button
          className={`px-4 py-2 text-sm ${
            rankType === "DOWN"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setRankType("DOWN")}
        >
          하락률 순
        </button>
      </div>

      {/* ===== 차트 / 리스트 ===== */}
      <div className="grid grid-cols-[3fr_1.5fr] gap-6">
        <PriceChangeChart data={filteredRankedChangePrice.slice(0, 10)} />
        <PriceChangeList data={filteredRankedChangePrice} sortType={rankType} />
      </div>
    </div>
  );
}
