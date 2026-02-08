"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";

type DataItem = {
  region: string;
  changeRate: number;
};

export function PriceChangeChart({ data }: { data: DataItem[] }) {
  const { minValue, maxValue } = useMemo(() => {
    if (!data.length) return { minValue: -5, maxValue: 5 };

    const maxAbs = Math.max(...data.map((d) => Math.abs(d.changeRate)));
    const rounded = Math.ceil(maxAbs / 5) * 5;

    return {
      minValue: -rounded,
      maxValue: rounded,
    };
  }, [data]);

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold mb-4">
        지역별 평균가 증감률(전기 대비)
      </h2>

      <div style={{ height: 520 }}>
        <ResponsiveBar
          data={data}
          keys={["changeRate"]}
          indexBy="region"
          margin={{ top: 40, right: 20, bottom: 80, left: 60 }}
          padding={0.35}
          valueScale={{ type: "linear", min: minValue, max: maxValue }}
          colors={({ data }) => (data.changeRate >= 0 ? "#ef4444" : "#2563eb")}
          axisLeft={{ format: (v) => `${v}%` }}
          axisBottom={{ tickRotation: -30 }}
          enableLabel={false}
          enableGridY={false}
          tooltip={({ id, value, indexValue }) => (
            <div className="bg-white px-3 py-2 rounded shadow text-sm">
              <strong>{indexValue}</strong>
              <div>
                {id}: {Number(value).toFixed(2)}%
              </div>
            </div>
          )}
          markers={[
            {
              axis: "y",
              value: 0,
              lineStyle: { stroke: "#000", strokeWidth: 2 },
            },
          ]}
          animate
        />
      </div>
    </div>
  );
}
