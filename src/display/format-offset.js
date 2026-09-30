const formatOffset = (offset) => {
  const minutes = Math.round(Math.abs(offset) * 60)
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  const remainder = String(minutes % 60).padStart(2, '0')
  return `UTC${offset < 0 ? '-' : '+'}${hours}:${remainder}`
}

export default formatOffset
