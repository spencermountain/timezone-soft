const tzArr = require('./zone.json');
// zone.json is JSON equivalent of IANA timezones in an array
const zoneArr = {}

function splitOnce(s, on) {
  [first, ...rest] = s.split(on)
  return [first, rest.join(on)]
}

for (const k of tzArr) {
  const [region, zone] = splitOnce(k, '/');
  if (zoneArr[region]) zoneArr[region].push(zone);
  else zoneArr[region] = [zone];
}

require("fs").writeFileSync("./results.json", JSON.stringify(zoneArr, null, 2))