/**
 * Utility helpers used across the app.
 */

/** Returns greeting based on current hour */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

/** Format a Date to "HH:MM AM/PM" */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/** Format a Date to "MMM D, YYYY" */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Clamp a number between min and max */
export function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
