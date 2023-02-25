/* eslint-disable no-extend-native */
// Prototypes

String.prototype.titleize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

String.prototype.formatStr = function () {
    return this.split("_").join(" ")
}
