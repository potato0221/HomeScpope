type BuildAgeType = "NEW" | "SEMI_NEW" | "OLD";

interface BuildAgeRow {
  region: string;
  newAvgPrice: number;
  semiNewAvgPrice: number;
  oldAvgPrice: number;
  rank: number;
}

interface TableProps {
  rows: BuildAgeRow[];
  buildAgeType: BuildAgeType;
}

export function RegionBuildAgeTable({ rows, buildAgeType }: TableProps) {
  const highlightColor = (type: BuildAgeType) => {
    if (type === "NEW") return "text-blue-600";
    if (type === "SEMI_NEW") return "text-purple-600";
    return "text-green-600";
  };

  const formatToEok = (price: number) =>
    `${(price / 100_000_000).toFixed(2)}억`;

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-md font-semibold mb-4">지역별 평균가 전체</h3>

      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b">
              <th className="text-left py-2">지역</th>

              <th
                className={`text-right ${
                  buildAgeType === "NEW" ? "text-blue-600 font-semibold" : ""
                }`}
              >
                신축
              </th>

              <th
                className={`text-right ${
                  buildAgeType === "SEMI_NEW"
                    ? "text-purple-600 font-semibold"
                    : ""
                }`}
              >
                준신축
              </th>

              <th
                className={`text-right ${
                  buildAgeType === "OLD" ? "text-green-600 font-semibold" : ""
                }`}
              >
                구축
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.region}
                className="border-b last:border-0 even:bg-slate-50 hover:bg-slate-100 transition"
              >
                <td className="py-2 font-medium">
                  {row.rank}. {row.region}
                </td>

                <td
                  className={`text-right ${
                    buildAgeType === "NEW"
                      ? `${highlightColor("NEW")} font-medium`
                      : ""
                  }`}
                >
                  {formatToEok(row.newAvgPrice)}
                </td>

                <td
                  className={`text-right ${
                    buildAgeType === "SEMI_NEW"
                      ? `${highlightColor("SEMI_NEW")} font-medium`
                      : ""
                  }`}
                >
                  {formatToEok(row.semiNewAvgPrice)}
                </td>

                <td
                  className={`text-right ${
                    buildAgeType === "OLD"
                      ? `${highlightColor("OLD")} font-medium`
                      : ""
                  }`}
                >
                  {formatToEok(row.oldAvgPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
