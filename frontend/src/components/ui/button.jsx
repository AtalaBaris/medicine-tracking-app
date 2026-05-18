/**
 * Button variants: "primary" | "secondary" | "ghost" | "danger"
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  icon,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-xs font-headline-md text-headline-md rounded-xl px-lg py-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-container focus:ring-primary hover:scale-[1.02] shadow-premium hover:shadow-premium-hover",
    secondary:
      "bg-primary-container text-on-primary hover:bg-primary focus:ring-primary-container hover:scale-[1.02] shadow-premium hover:shadow-premium-hover",
    ghost:
      "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-variant focus:ring-outline",
    danger:
      "bg-error text-on-error hover:bg-error/90 focus:ring-error hover:scale-[1.02]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}
