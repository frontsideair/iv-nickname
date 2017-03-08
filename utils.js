async function delay (duration) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration * 1000)
  })
}

function random ({ from = 0, to = 10, round = true, inclusive = round ? true : false } = {}) {
  const range = to - from + (inclusive ? 1 : 0)
  const number = Math.random() * range + from
  return round ? Math.floor(number) : number
}

function pad2 (string) {
  return (string < 10 ? '0' : '') + string
}

module.exports = {
  delay,
  random,
  pad2,
}
