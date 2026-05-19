export const WEEK_DAYS_TR = [
  { id: 1, short: "Pzt", full: "Pazartesi" },
  { id: 2, short: "Sal", full: "Salı" },
  { id: 3, short: "Çar", full: "Çarşamba" },
  { id: 4, short: "Per", full: "Perşembe" },
  { id: 5, short: "Cum", full: "Cuma" },
  { id: 6, short: "Cmt", full: "Cumartesi" },
  { id: 0, short: "Paz", full: "Pazar" },
];

export const TIME_PRESETS = [
  { label: "Sabah", time: "08:00" },
  { label: "Öğle", time: "13:00" },
  { label: "Akşam", time: "21:00" },
  { label: "Gece", time: "23:00" },
];

export const FREQUENCY_OPTIONS = [
  { value: "Once a day", label: "Günde 1 kez", slots: 1 },
  { value: "Twice a day", label: "Günde 2 kez", slots: 2 },
  { value: "Three times a day", label: "Günde 3 kez", slots: 3 },
  { value: "As needed", label: "İhtiyaç halinde", slots: 1 },
];

export function slotsRequiredForFrequency(frequency) {
  const opt = FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return opt?.slots ?? 1;
}

/** Sıklığa uygun saat sayısını garanti eder (ör. günde 2 → 08:00 + 20:00). */
export function ensureSlotsForFrequency(frequency, slots, createSlot) {
  const defaults = defaultTimesForFrequency(frequency);
  const required = slotsRequiredForFrequency(frequency);
  const valid = slots.filter((s) => s?.time);

  if (frequency === "As needed") {
    return valid.length ? valid : [createSlot("08:00")];
  }

  const times = [...valid];
  const have = new Set(times.map((s) => s.time.slice(0, 5)));

  for (const t of defaults) {
    if (times.length >= required) break;
    if (!have.has(t)) {
      times.push(createSlot(t));
      have.add(t);
    }
  }

  return times.slice(0, required);
}

export function defaultTimesForFrequency(frequency) {
  switch (frequency) {
    case "Twice a day":
      return ["08:00", "20:00"];
    case "Three times a day":
      return ["08:00", "14:00", "20:00"];
    case "As needed":
      return ["08:00"];
    default:
      return ["08:00"];
  }
}

export function daysFromMode(mode, customSelected) {
  if (mode === "everyday") return "Her Gün";
  if (mode === "weekdays") return "Pazartesi, Salı, Çarşamba, Perşembe, Cuma";
  if (mode === "weekends") return "Cumartesi, Pazar";
  const picked = WEEK_DAYS_TR.filter((d) => customSelected[d.id]).map((d) => d.full);
  return picked.length ? picked.join(", ") : "Her Gün";
}

export function formatTime24(time24) {
  if (!time24) return "";
  const [h, m] = String(time24).split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m ?? 0).padStart(2, "0")}`;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
