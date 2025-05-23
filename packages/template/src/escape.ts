export function escape(v: unknown) {
  return `${v}`
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&#34;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
