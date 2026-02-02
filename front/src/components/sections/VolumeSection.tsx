import { useMemo, useState } from "react";
import { UserPriceBarChart } from "@/components/charts/UserPriceBarChart";
import { VolumeTable } from "@/components/lists/VolumeTable";

interface DataItem {
  region: string;
  count: number;
}

export default function VolumeSection({ data }: { data: DataItem[] }) {
  const [sortType, setSortType] = useState<"TOP" | "BOTTOM">("TOP");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) =>
      sortType === "TOP" ? b.count - a.count : a.count - b.count,
    );
  }, [data, sortType]);

  //차트용 슬라이스(10)
  const volumeChartData = useMemo(() => {
    return sorted.slice(0, 10).map((d) => ({
      region: d.region,
      value: d.count,
    }));
  }, [sorted]);

  return (
    <div>
      <div className="inline-flex rounded-lg border overflow-hidden mb-4">
        <button
          className={`px-4 py-2 text-sm ${
            sortType === "TOP" ? "bg-slate-800 text-white" : "bg-white"
          }`}
          onClick={() => setSortType("TOP")}
        >
          상위 10
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            sortType === "BOTTOM" ? "bg-slate-800 text-white" : "bg-white"
          }`}
          onClick={() => setSortType("BOTTOM")}
        >
          하위 10
        </button>
      </div>
      <div className="grid grid-cols-[3fr_1.5fr] gap-6">
        {/* ===== 차트 ===== */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">지역별 거래량</h2>

          {volumeChartData.length === 0 ? (
            <div className="text-gray-400">데이터 없음</div>
          ) : (
            <UserPriceBarChart
              data={volumeChartData}
              valueFormatter={(v) => `${v.toLocaleString()}건`}
            />
          )}
        </div>
        <VolumeTable data={sorted} />
      </div>
    </div>
  );
}
