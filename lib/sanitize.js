export function sanitizeHtml(html) {
  if (!html) return '';
  // remove script/style tags and their content
  let out = html.replace(/<\/(?:script|style)>/gi, '')
                .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  // remove on* event handlers and javascript: URLs
  out = out.replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, '')
           .replace(/ on[a-z]+\s*=\s*'[^']*'/gi, '')
           .replace(/ on[a-z]+\s*=\s*[^\s>]+/gi, '')
           .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
           .replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");
  return out;
}

