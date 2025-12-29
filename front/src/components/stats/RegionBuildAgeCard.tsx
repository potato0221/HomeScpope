import { formatKoreanPrice } from "@/lib/utils/priceFormatter";

type CardProps = {
  region: string;
  newPrice: number;
  semiNewPrice: number;
  oldPrice: number;
  buildAgeType: "NEW" | "SEMI_NEW" | "OLD";
};

export function RegionBuildAgeCard({
  region,
  newPrice,
  semiNewPrice,
  oldPrice,
  buildAgeType,
}: CardProps) {
  const items = [
    { key: "NEW", label: "신축", value: newPrice },
    { key: "SEMI_NEW", label: "준신축", value: semiNewPrice },
    { key: "OLD", label: "구축", value: oldPrice },
  ];

  //신구축 글씨 하이라이트
  const highlightColor = (type: "NEW" | "SEMI_NEW" | "OLD") => {
    if (type === "NEW") return "text-blue-600";
    if (type === "SEMI_NEW") return "text-purple-600";
    return "text-green-600";
  };

  return (
    <div className="rounded-xl border bg-white p-5 hover:shadow-md transition">
      <h3 className="font-bold text-slate-900 mb-4">{region}</h3>

      <div className="space-y-2 text-sm">
        {items.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span className="text-slate-500">{item.label}</span>
            <span
              className={
                item.key === buildAgeType
                  ? `${highlightColor(buildAgeType)} font-semibold`
                  : "text-slate-700"
              }
            >
              {formatKoreanPrice(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
