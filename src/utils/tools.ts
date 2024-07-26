export function titleize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatStr(str: string): string {
  return str.split('_').join(' ')
}
