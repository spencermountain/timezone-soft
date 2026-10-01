const isOffset = /^([-+]?[0-9]+)h(r?s)?$/i
const isNumber = /^([-+]?[0-9]+)$/
const utcOffset = /^utc([\-+]?[0-9]+)$/i
const gmtOffset = /^(?:etc\/)?gmt([\-+]?[0-9]+)$/i

const toIana = (num) => {
  num = Number(num)
  if (num === 0) {
    return 'Etc/GMT'
  }
  if (num >= -12 && num <= 14) {
    num = num * -1 // IANA Etc/GMT signs are reversed.
    num = (num > 0 ? '+' : '') + num
    return 'Etc/GMT' + num
  }
  return null
}

const parseOffset = (tz) => {
  tz = tz.trim()
  // '+5hrs'
  let m = tz.match(isOffset)
  if (m !== null) {
    return toIana(m[1])
  }
  // 'utc+5'
  m = tz.match(utcOffset)
  if (m !== null) {
    return toIana(m[1])
  }
  // 'GMT-5' (not opposite)
  m = tz.match(gmtOffset)
  if (m !== null) {
    const num = Number(m[1]) * -1
    return toIana(num)
  }
  // '+5'
  m = tz.match(isNumber)
  if (m !== null) {
    return toIana(m[1])
  }
  return null
}
export default parseOffset
