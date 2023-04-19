

const addEtc = function (zones) {
  for (let i = 0; i <= 14; i += 1) {
    zones[`Etc/GMT-${i}`] = {
      offset: i,
      meta: `gmt-${i}`,
      hem: 'n'//sorry
    }
    zones[`Etc/GMT+${i}`] = {
      offset: i * -1,
      meta: `gmt+${i}`,
      hem: 'n'//sorry
    }
  }
}

export default addEtc