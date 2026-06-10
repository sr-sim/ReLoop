import type { CardProps } from "../types";

export default function Card({ children, className = "", onClick, hoverable = false }: CardProps) {
  const hoverClasses = hoverable
    ? "hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md border border-gray-100 ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
