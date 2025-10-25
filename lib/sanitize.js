export function sanitizeHtml(html) {
  if (!html) return '';
  
  // remove script/style tags and their content, but keep safe tags
  let out = html.replace(/<\/(?:script|style)>/gi, '')
                .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  
  // remove on* event handlers from all tags except safe attributes
  out = out.replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, '')
           .replace(/ on[a-z]+\s*=\s*'[^']*'/gi, '')
           .replace(/ on[a-z]+\s*=\s*[^\s>]+/gi, '');
  
  // remove javascript: URLs but preserve data-* attributes and legitimate URLs
  out = out.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
           .replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'")
           .replace(/src\s*=\s*"javascript:[^"]*"/gi, 'src=""')
           .replace(/src\s*=\s*'javascript:[^']*'/gi, "src=''");
  
  return out;
}

