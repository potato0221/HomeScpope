import { formatKoreanPrice } from "@/lib/utils/priceFormatter";

type Props = {
  data: { region: string; value: number }[];
  statType: "AVG_PRICE" | "AVG_PRICE_PER_AREA";
};

export function AvgPriceTable({ data, statType }: Props) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold mb-4">지역별 순위</h2>

      <div className="max-h-[360px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b">
              <th className="text-left py-2">순위</th>
              <th className="text-left">지역</th>
              <th className="text-right">
                {statType === "AVG_PRICE" ? "평균가" : "평당가"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={d.region} className="border-b last:border-0">
                <td className="py-2">{idx + 1}</td>
                <td>{d.region}</td>
                <td className="text-right">{formatKoreanPrice(d.value)}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
