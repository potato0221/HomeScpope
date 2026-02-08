interface DataItem {
  region: string;
  changeRate: number;
  rank: number;
}

export function PriceChangeList({
  data,
  sortType,
}: {
  data: DataItem[];
  sortType: "UP" | "DOWN";
}) {
  return (
    <div className="bg-white rounded-xl border p-4 h-[620px] overflow-y-auto">
      <h3 className="font-semibold mb-3 text-sm text-gray-700">
        {sortType === "UP" ? "상승률 순" : "하락률 순"}
      </h3>

      <div className="space-y-2">
        {data.map((d) => (
          <div
            key={d.region}
            className="flex justify-between items-center border rounded px-3 py-2"
          >
            <span className="text-sm text-gray-600">
              {d.rank}. {d.region}
            </span>

            <span
              className={`font-semibold ${
                d.changeRate >= 0 ? "text-red-500" : "text-blue-500"
              }`}
            >
              {d.changeRate.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
