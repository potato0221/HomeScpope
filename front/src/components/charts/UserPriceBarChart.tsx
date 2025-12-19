"use client";

import { ResponsiveBar } from "@nivo/bar";
import { formatKoreanPrice } from "@/lib/utils/priceFormatter";

export function UserPriceBarChart({ data }: { data: any[] }) {
  return (
    <div style={{ height: 420 }}>
      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="region"
        margin={{ top: 40, right: 30, bottom: 80, left: 80 }}
        padding={0.3}
        colors={({ index }) => {
          const r = 24;
          const g = 48;
          const b = 140;

          const alpha = Math.max(0.35, 1 - index * 0.07);

          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }}
        valueScale={{ type: "linear" }}
        axisBottom={{
          tickRotation: -30,
          legend: "지역",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        axisLeft={{
          format: (v) => formatKoreanPrice(Number(v)),
        }}
        enableLabel={false}
        layers={[
          "grid",
          "axes",
          "bars",
          "markers",
          "legends",
          ({ bars }) =>
            bars.map((bar) => (
              <text
                key={bar.key}
                x={bar.x + bar.width / 2}
                y={bar.y - 6}
                textAnchor="middle"
                fontSize={12}
                fill="#1E3A8A" // blue-900
              >
                {formatKoreanPrice(bar.data.value as number)}
              </text>
            )),
        ]}
        tooltip={({ value, indexValue }) => (
          <div
            style={{
              padding: 8,
              background: "white",
              border: "1px solid #ddd",
              whiteSpace: "nowrap",
            }}
          >
            <strong>{indexValue}</strong>
            <div>{formatKoreanPrice(Number(value))}</div>
          </div>
        )}
        borderRadius={8}
        enableGridY={false}
        animate
      />
    </div>
  );
}
