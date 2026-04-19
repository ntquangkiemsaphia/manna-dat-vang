// Strip HTML tags and decode common HTML entities for plain-text previews
export const stripHtml = (html?: string | null): string => {
  if (!html) return "";
  // Remove tags
  let text = html.replace(/<[^>]*>/g, " ");
  // Decode entities using the browser when available
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(text, "text/html");
      text = doc.documentElement.textContent || text;
    } catch {
      // fall through to manual decoding
    }
  }
  // Manual fallback for the most common entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
  // Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
};
