const DEFAULT_TIMES = {
  1: ["08:00"],
  2: ["08:00", "20:00"],
  3: ["08:00", "14:00", "20:00"],
};

function expectedDailyCount(frequency) {
  if (!frequency) return 1;
  const f = String(frequency).toLowerCase();
  if (f.includes("3") || f.includes("üç") || f.includes("three")) return 3;
  if (f.includes("2") || f.includes("iki") || f.includes("twice")) return 2;
  if (f.includes("ihtiyaç") || f.includes("as needed")) return 1;
  return 1;
}

function defaultTimesForCount(count) {
  return DEFAULT_TIMES[count] || DEFAULT_TIMES[1];
}

function normalizeTime(t) {
  return String(t || "08:00").slice(0, 5);
}

/** Sıklığa göre eksik saatleri tamamlar (ör. günde 2 kez → 2 hatırlatıcı). */
function expandSchedules(schedules, frequency, daysLabel) {
  const expected = expectedDailyCount(frequency);
  const days = daysLabel || "Her Gün";

  const fromInput = (Array.isArray(schedules) ? schedules : [])
    .filter((s) => s?.time)
    .map((s) => ({
      time: normalizeTime(s.time),
      days: s.days || days,
      label: s.label || "",
    }));

  const uniqueTimes = [];
  for (const s of fromInput) {
    if (!uniqueTimes.includes(s.time)) uniqueTimes.push(s.time);
  }

  const defaults = defaultTimesForCount(expected);
  for (const t of defaults) {
    if (uniqueTimes.length >= expected) break;
    if (!uniqueTimes.includes(t)) uniqueTimes.push(t);
  }

  while (uniqueTimes.length < expected) {
    const fallback = defaults[uniqueTimes.length] || "12:00";
    if (!uniqueTimes.includes(fallback)) uniqueTimes.push(fallback);
    else break;
  }

  const finalTimes =
    expectedDailyCount(frequency) > 1 && !String(frequency).toLowerCase().includes("ihtiyaç")
      ? uniqueTimes.slice(0, expected)
      : uniqueTimes;

  const labelByTime = Object.fromEntries(fromInput.map((s) => [s.time, s.label]));

  return finalTimes.map((time) => ({
    time,
    days,
    label: labelByTime[time] || "",
  }));
}

module.exports = {
  expectedDailyCount,
  defaultTimesForCount,
  expandSchedules,
  normalizeTime,
};
