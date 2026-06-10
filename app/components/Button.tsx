import type { ButtonProps } from "../types";

const variantMap: Record<string, string> = {
  primary: "bg-[#27667B] text-white hover:bg-[#1e5265] border border-transparent",
  secondary: "bg-[#A0C878] text-[#143D60] hover:bg-[#8fb566] border border-transparent",
  outline: "bg-transparent text-[#27667B] border border-[#27667B] hover:bg-[#27667B]/10",
  ghost: "bg-transparent text-[#27667B] border border-transparent hover:bg-[#27667B]/10",
};

const sizeMap: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  fullWidth = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const variantClasses = variantMap[variant] ?? variantMap.primary;
  const sizeClasses = sizeMap[size] ?? sizeMap.md;
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27667B] ${variantClasses} ${sizeClasses} ${widthClass} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
