/**
 * MedCard variants: "default" | "low-stock" | "as-needed"
 *
 * @param {{
 *   name: string,
 *   dose: string,
 *   frequency: string,
 *   icon: string,
 *   inventoryLabel: string,
 *   inventoryPct?: number,   // 0-100, omit to hide bar
 *   variant?: "default" | "low-stock" | "as-needed",
 *   onRefill?: () => void,
 * }} props
 */
export default function MedCard({
  name,
  dose,
  frequency,
  icon = "medication",
  inventoryLabel,
  inventoryPct,
  variant = "default",
  onRefill,
}) {
  const isLowStock = variant === "low-stock";
  const isAsNeeded = variant === "as-needed";

  const iconBg = isLowStock
    ? "bg-error/10 text-error"
    : isAsNeeded
    ? "bg-secondary-container text-on-secondary-container"
    : "bg-primary/10 text-primary";

  const barColor = isLowStock ? "bg-error" : isAsNeeded ? "bg-secondary" : "bg-primary";

  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 p-md flex flex-col group relative overflow-hidden
        ${isLowStock ? "border border-error-container" : "border border-[#EBECF0]"}`}
    >
      {/* Red accent strip for low-stock */}
      {isLowStock && (
        <div className="absolute top-0 left-0 w-1 h-full bg-error" />
      )}

      {/* Header */}
      <div className={`flex justify-between items-start mb-md ${isLowStock ? "pl-unit" : ""}`}>
        <div className="flex items-center gap-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
            <span className="material-symbols-outlined filled">{icon}</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base">{name}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {dose} • {frequency}
            </p>
          </div>
        </div>

        {isLowStock && (
          <span className="bg-error/10 text-error px-sm py-xs rounded-md font-label-caps text-label-caps flex items-center gap-xs">
            <span className="material-symbols-outlined text-[12px]">warning</span> Low
          </span>
        )}
        {isAsNeeded && (
          <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded-md font-label-caps text-label-caps">
            As Needed
          </span>
        )}
        {!isLowStock && !isAsNeeded && (
          <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t border-[#EBECF0] pt-md mt-auto ${isLowStock ? "pl-unit" : ""}`}>
        <div className="flex justify-between items-center mb-xs">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Inventory</span>
          <span className={`font-body-sm text-body-sm font-semibold ${isLowStock ? "text-error" : "text-on-surface"}`}>
            {inventoryLabel}
          </span>
        </div>

        {inventoryPct !== undefined && !isLowStock && (
          <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
            <div
              className={`h-full ${barColor} rounded-full`}
              style={{ width: `${inventoryPct}%` }}
            />
          </div>
        )}

        {isLowStock && onRefill && (
          <button
            onClick={onRefill}
            className="w-full mt-sm bg-primary-container text-on-primary py-sm rounded-lg font-label-caps text-label-caps hover:bg-primary transition-colors flex justify-center items-center gap-xs"
          >
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            Refill Stock
          </button>
        )}
      </div>
    </div>
  );
}
