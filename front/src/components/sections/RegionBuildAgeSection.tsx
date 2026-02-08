import { useMemo, useState } from "react";
import { RegionBuildAgeCard } from "@/components/lists/RegionBuildAgeCard";
import { RegionBuildAgeTable } from "@/components/lists/RegionBuildAgeTable";

type BuildageType = "NEW" | "SEMI_NEW" | "OLD";
type RankType = "TOP" | "BOTTOM";

interface BuildAgeRow {
  region: string;
  newAvgPrice: number;
  semiNewAvgPrice: number;
  oldAvgPrice: number;
}

interface RegionBuildAgeSectionProps {
  rows: BuildAgeRow[];
  keyword: string;
}

export default function RegionBuildAgeSection({
  rows,
  keyword,
}: RegionBuildAgeSectionProps) {
  const [buildAgeSortKey, setBuildAgeSortKey] = useState<BuildageType>("NEW");
  const [buildAgeRankType, setBuildAgeRankType] = useState<RankType>("TOP");

  //신구축 정렬
  const rankedBuildAge = useMemo(() => {
    const getValue = (row: any) => {
      if (buildAgeSortKey === "NEW") return row.newAvgPrice;
      if (buildAgeSortKey === "SEMI_NEW") return row.semiNewAvgPrice;
      return row.oldAvgPrice;
    };

    return [...rows]
      .sort((a, b) => {
        const diff = getValue(b) - getValue(a);
        return buildAgeRankType === "TOP" ? diff : -diff;
      })
      .map((row, index) => ({
        ...row,
        rank: index + 1,
      }));
  }, [rows, buildAgeSortKey, buildAgeRankType]);

  //검색 데이터
  const filteredRankedBuildAge = useMemo(() => {
    if (!keyword) return rankedBuildAge;

    return rankedBuildAge.filter((r) => r.region.includes(keyword));
  }, [rankedBuildAge, keyword]);

  //카드 슬라이스(10)
  const buildAgeCardData = useMemo(() => {
    return filteredRankedBuildAge.slice(0, 10);
  }, [filteredRankedBuildAge]);

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold mb-6">
        지역별 신축 / 준신축 / 구축 평균가
      </h2>

      {keyword && filteredRankedBuildAge.length === 0 && (
        <div className="text-sm text-gray-400">검색 결과가 없습니다.</div>
      )}

      {/* ===== 정렬 버튼 ===== */}
      <div className="flex gap-4 mb-6">
        {/* 신축 / 준신축 / 구축 */}
        <div className="inline-flex rounded-lg border bg-white overflow-hidden">
          {(
            [
              ["NEW", "신축"],
              ["SEMI_NEW", "준신축"],
              ["OLD", "구축"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setBuildAgeSortKey(key)}
              className={`px-4 py-2 text-sm font-medium transition
              ${
                buildAgeSortKey === key
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border bg-white overflow-hidden">
          {(
            [
              ["TOP", "상위"],
              ["BOTTOM", "하위"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setBuildAgeRankType(key)}
              className={`px-4 py-2 text-sm font-medium transition
              ${
                buildAgeRankType === key
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[3fr_1.5fr] gap-6">
        {/* ===== 카드 ===== */}
        <div className="max-h-[520px] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {buildAgeCardData.map((row) => (
              <RegionBuildAgeCard
                key={row.region}
                region={row.region}
                newPrice={row.newAvgPrice}
                semiNewPrice={row.semiNewAvgPrice}
                oldPrice={row.oldAvgPrice}
                buildAgeType={buildAgeSortKey}
              />
            ))}
          </div>
        </div>
        {/* ===== 테이블 ===== */}
        <RegionBuildAgeTable
          rows={filteredRankedBuildAge}
          buildAgeType={buildAgeSortKey}
        />
      </div>
    </div>
  );
}
