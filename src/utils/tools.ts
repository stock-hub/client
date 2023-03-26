export {}
/* eslint-disable no-extend-native */
// Prototypes
declare global {
  interface String {
    titleize(): string
    formatStr(): string
  }
}

String.prototype.titleize = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

String.prototype.formatStr = function (): string {
  return this.split('_').join(' ')
}
