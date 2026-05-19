const DAY_NAMES_TR = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

function reminderAppliesOnDate(daysStr, date) {
  if (!daysStr) return true;
  const normalized = String(daysStr).trim();
  if (!normalized || normalized === "Her Gün" || normalized.toLowerCase().includes("her gün")) {
    return true;
  }
  const dow = date.getDay();
  if (normalized.includes("Hafta İçi")) return dow >= 1 && dow <= 5;
  if (normalized.includes("Hafta Sonu")) return dow === 0 || dow === 6;
  // Sıklık metni yanlışlıkla days sütununa yazılmışsa her gün say
  if (/günde|kez|ihtiyaç|as needed/i.test(normalized)) return true;
  const dayName = DAY_NAMES_TR[dow];
  return normalized.includes(dayName);
}

module.exports = { reminderAppliesOnDate, DAY_NAMES_TR };
