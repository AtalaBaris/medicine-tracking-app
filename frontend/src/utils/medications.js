import { WEEK_DAYS_TR } from "./scheduleForm";

export const FORM_TO_DB = {
  Tablet: "Tablet",
  Capsule: "Kapsül",
  Liquid: "Şurup",
  Injection: "İğne",
  Damla: "Damla",
};

export const FREQUENCY_TO_DB = {
  "Once a day": "Günde 1 kez",
  "Twice a day": "Günde 2 kez",
  "Three times a day": "Günde 3 kez",
  "As needed": "İhtiyaç halinde",
};

export const DB_TO_FORM = {
  Tablet: "Tablet",
  Kapsül: "Capsule",
  Şurup: "Liquid",
  İğne: "Injection",
  Damla: "Damla",
};

export const DB_TO_FREQUENCY = {
  "Günde 1 kez": "Once a day",
  "Günde 2 kez": "Twice a day",
  "Günde 3 kez": "Three times a day",
  "İhtiyaç halinde": "As needed",
};

export function parseDosage(dosage) {
  if (!dosage) return { value: "", unit: "mg" };
  const units = ["mg", "ml", "mcg", " adet", "adet"];
  for (const u of units) {
    if (dosage.endsWith(u)) {
      return { value: dosage.slice(0, -u.length).trim(), unit: u.startsWith(" ") ? u : u };
    }
  }
  return { value: dosage, unit: "mg" };
}

export function daysStringToMode(daysStr) {
  const customDefault = Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 0].map((id) => [id, true])
  );
  if (!daysStr || daysStr.includes("Her Gün")) {
    return { mode: "everyday", custom: customDefault };
  }
  if (daysStr.includes("Hafta İçi")) {
    return { mode: "weekdays", custom: customDefault };
  }
  if (daysStr.includes("Hafta Sonu") || daysStr.includes("Cumartesi, Pazar")) {
    return { mode: "weekends", custom: customDefault };
  }
  const custom = Object.fromEntries(
    WEEK_DAYS_TR.map((d) => [d.id, daysStr.includes(d.full)])
  );
  return { mode: "custom", custom };
}

export function frequencyFromDb(dbFreq) {
  if (!dbFreq) return "Once a day";
  const key = Object.entries(DB_TO_FREQUENCY).find(([tr]) => dbFreq.includes(tr))?.[1];
  return key || "Once a day";
}

export function groupMedications(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, { ...row, times: [] });
    }
    if (row.time) {
      const t = String(row.time).slice(0, 5);
      if (!map.get(row.id).times.includes(t)) {
        map.get(row.id).times.push(t);
      }
    }
  }

  for (const med of map.values()) {
    med.times.sort();
    if (med.times.length >= 3) {
      med.frequency = "Günde 3 kez";
    } else if (med.times.length === 2) {
      med.frequency = "Günde 2 kez";
    }
  }

  return [...map.values()];
}

export function mapMedicationToCard(med) {
  const stock = med.stockQuantity ?? 0;
  let freq = med.frequency || med.days || "Günlük";
  if (med.times?.length >= 2) {
    const timesLabel = med.times.join(", ");
    freq =
      med.times.length >= 3
        ? `Günde 3 kez · ${timesLabel}`
        : `Günde 2 kez · ${timesLabel}`;
  }
  const asNeeded =
    freq.toLowerCase().includes("ihtiyaç") ||
    freq.toLowerCase().includes("as needed") ||
    freq.toLowerCase().includes("prn");
  const lowStock = stock > 0 && stock <= 3;

  let variant = "default";
  if (asNeeded) variant = "as-needed";
  else if (lowStock) variant = "low-stock";

  const inventoryLabel =
    stock <= 0
      ? "Stok yok"
      : lowStock
      ? `${stock} doz kaldı`
      : `${stock} adet`;

  const inventoryPct =
    stock > 0 ? Math.min(100, Math.round((stock / 30) * 100)) : undefined;

  return {
    id: med.id,
    name: med.name,
    dose: med.dosage || "",
    frequency: freq,
    icon: asNeeded ? "prescriptions" : "medication",
    inventoryLabel,
    inventoryPct: variant === "low-stock" ? null : inventoryPct,
    variant,
  };
}

export function greetingName(fullName) {
  if (!fullName) return "";
  const first = fullName.trim().split(/\s+/)[0];
  const hour = new Date().getHours();
  if (hour < 12) return `Günaydın, ${first}`;
  if (hour < 18) return `İyi günler, ${first}`;
  return `İyi akşamlar, ${first}`;
}
