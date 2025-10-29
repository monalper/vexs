export function formatDateLong(input, opts = {}) {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const { timeZone = 'UTC' } = opts;
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone
    }).format(date);
  } catch {
    // Fallback if Intl options fail for some reason
    return date.toISOString().slice(0, 10);
  }
}

