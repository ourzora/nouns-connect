export function formatPretty(input: string): string {
  return input
    .replace(/([A-Z])(?=[a-z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
}
