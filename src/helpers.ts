export function getIncludes(param?: string): string[] {
  return param?.split(',').map((s) => s.trim()).filter(Boolean) || []
}
