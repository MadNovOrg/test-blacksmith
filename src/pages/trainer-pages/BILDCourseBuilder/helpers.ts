export function hasKeyStartingWith(
  obj: Record<string, boolean>,
  prefix: string
): boolean {
  return Object.keys(obj).some(key => key.startsWith(prefix) && obj[key])
}
