const { GoogleLogin, Client, Utils } = require('pogobuf')
const names = require('./pokemon')

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

async function getPokemon (client) {
  const inventory = await client.getInventory(0)
  return Utils.splitInventory(inventory).pokemon.filter(p => p.is_egg === false)
}

async function changeNicknames (method, user, pass) {
  const client = new Client()
  const token = await new GoogleLogin().login(user, pass)
  client.setAuthInfo('google', token)
  await client.init()
  const pokemon = await getPokemon(client)
  let counter = 0

  for (const p of pokemon) {
    const { id, pokemon_id, nickname, individual_attack, individual_defense, individual_stamina } = p
    const total = pad2(individual_attack + individual_defense + individual_stamina)
    const stamina = pad2(individual_stamina)
    const attack = pad2(individual_attack)
    const defense = pad2(individual_defense)
    const proposed_nickname = `${total}:${stamina}.${attack}.${defense}`

    if (nickname !== proposed_nickname) {
      console.log(`Will rename ${names.find(n => n.id == pokemon_id).name} to ${proposed_nickname}...`)
      try {
        await client.nicknamePokemon(id, proposed_nickname)
        const duration = random({ from: 1, to: 2, round: false })
        console.log(`Done! Waiting ${duration} seconds...`)
        counter++
        await delay(duration)
      } catch (e) {
        console.error('Could not change nickname:', e)
      }
    }
  }

  console.log(`All ${counter} operations complete!`)
}

module.exports = changeNicknames
