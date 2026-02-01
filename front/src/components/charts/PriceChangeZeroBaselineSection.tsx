"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";

type DataItem = {
  region: string;
  changeRate: number;
};

type Props = {
  data: DataItem[];
  sortType: "UP" | "DOWN";
};

export function PriceChangeZeroBaselineSection({ data, sortType }: Props) {
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) =>
      sortType === "UP"
        ? b.changeRate - a.changeRate
        : a.changeRate - b.changeRate,
    );

    return sorted.slice(0, 10);
  }, [data, sortType]);

  const allSortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      sortType === "UP"
        ? b.changeRate - a.changeRate
        : a.changeRate - b.changeRate,
    );
  }, [data, sortType]);

  //차트 스케일 계산
  const { minValue, maxValue } = useMemo(() => {
    if (data.length === 0) {
      return { minValue: -5, maxValue: 5 };
    }

    const maxAbs = Math.max(...data.map((d) => Math.abs(d.changeRate)));

    const rounded = Math.ceil(maxAbs / 5) * 5;

    return {
      minValue: -rounded,
      maxValue: rounded,
    };
  }, [data]);

  return (
    <div className="grid grid-cols-[3fr_1.5fr] gap-6">
      {/* ================= LEFT : CHART ================= */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">
          지역별 평균가 증감률(전기 대비)
        </h2>

        <div style={{ height: 520 }}>
          <ResponsiveBar
            data={sortedData}
            keys={["changeRate"]}
            indexBy="region"
            layout="vertical"
            margin={{ top: 40, right: 20, bottom: 80, left: 60 }}
            padding={0.35}
            valueScale={{
              type: "linear",
              min: minValue,
              max: maxValue,
            }}
            colors={({ data }) =>
              data.changeRate >= 0 ? "#ef4444" : "#2563eb"
            }
            axisLeft={{
              format: (v) => `${v}%`,
            }}
            axisBottom={{
              tickRotation: -30,
            }}
            enableLabel={false}
            enableGridY={false}
            markers={[
              {
                axis: "y",
                value: 0,
                lineStyle: {
                  stroke: "#000",
                  strokeWidth: 2,
                },
              },
            ]}
            layers={[
              "grid",
              "axes",
              "bars",
              "markers",
              ({ bars }) =>
                bars.map((bar) => {
                  const raw = bar.data.value;
                  const value =
                    typeof raw === "number" && Number.isFinite(raw) ? raw : 0;

                  const isPositive = value >= 0;

                  return (
                    <g key={bar.key}>
                      {/* 지역명 */}
                      <text
                        x={bar.x + bar.width / 2}
                        y={isPositive ? bar.y + bar.height + 18 : bar.y - 6}
                        textAnchor="middle"
                        fontSize={12}
                        fill="#111"
                      >
                        {bar.data.region}
                      </text>

                      {/* 퍼센트 */}
                      <text
                        x={bar.x + bar.width / 2}
                        y={isPositive ? bar.y - 6 : bar.y + bar.height + 18}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={600}
                        fill={isPositive ? "#ef4444" : "#2563eb"}
                      >
                        {value.toFixed(2)}%
                      </text>
                    </g>
                  );
                }),
            ]}
            tooltip={({ indexValue, value }) => (
              <div
                style={{
                  padding: 8,
                  background: "white",
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                }}
              >
                <strong>{indexValue}</strong>
                <div>{Number(value).toFixed(2)}%</div>
              </div>
            )}
            animate
          />
        </div>
      </div>

      {/* ================= 카드 리스트 ================= */}
      <div className="bg-white rounded-xl border p-4 h-[620px] overflow-y-auto">
        <h3 className="font-semibold mb-3 text-sm text-gray-700">
          {sortType === "UP" ? "상승률 순" : "하락률 순"}
        </h3>

        <div className="space-y-2">
          {allSortedData.map((d, idx) => (
            <div
              key={d.region}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <span className="text-sm text-gray-600">
                {idx + 1}. {d.region}
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
    </div>
  );
}
