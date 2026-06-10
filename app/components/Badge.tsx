import type { BadgeProps } from "../types";

const colorMap: Record<string, string> = {
  reduce: "bg-yellow-100 text-yellow-800",
  reuse: "bg-teal-100 text-teal-800",
  recycle: "bg-green-100 text-green-800",
  good: "bg-emerald-100 text-emerald-800",
  fair: "bg-amber-100 text-amber-800",
  new: "bg-blue-100 text-blue-800",
};

export default function Badge({ label, color }: BadgeProps) {
  const classes = colorMap[color] ?? "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}
