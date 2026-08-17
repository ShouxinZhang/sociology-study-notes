function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** 只处理代码块、行内代码和换行，避免引入整套 Markdown 运行时。 */
export function renderMarkdown(source: string): string {
  const escaped = escapeHtml(source);
  const withFences = escaped.replace(/```(?:\w+\n)?([\s\S]*?)```/g, (_match, code: string) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });
  return withFences
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}
