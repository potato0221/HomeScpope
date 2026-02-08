type Props = {
  data: { region: string; count: number; rank: number }[];
};

export function VolumeTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold mb-4">지역별 거래량 순위</h2>

      <div className="max-h-[360px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b">
              <th className="text-left py-2">순위</th>
              <th className="text-left">지역</th>
              <th className="text-right">거래량</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.region} className="border-b last:border-0">
                <td className="py-2">{d.rank}</td>
                <td>{d.region}</td>
                <td className="text-right">{d.count.toLocaleString()}건</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
