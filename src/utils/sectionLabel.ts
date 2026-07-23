export function formatSectionLabel(label: string) {
  const match = label.match(/^(\d{2})\s*[·/]\s*(.+)$/);

  if (!match) return label;

  return `[ ${match[1]} / ${match[2].toUpperCase()} ]`;
}
