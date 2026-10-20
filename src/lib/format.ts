const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(s: string) {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, (_m, text, href) => {
      const external = href.startsWith("http");
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
    });
}

/** Tiny, safe Markdown subset used by the CMS: paragraphs, ## headings, bullets, bold, italics, links. */
export function renderRichText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-•*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      const h = block.match(/^(#{2,3})\s+(.+)$/);
      if (h && lines.length === 1) return h[1].length === 2 ? `<h2>${inline(h[2])}</h2>` : `<h3>${inline(h[2])}</h3>`;
      return `<p>${lines.map(inline).join("<br />")}</p>`;
    })
    .join("\n");
}

export function readingTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
