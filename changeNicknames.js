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

function truncateDecimals (number, digits) {
	var multiplier = Math.pow(10, digits),
	adjustedNum = number * multiplier,
	truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
	
	return truncatedNum / multiplier;
}

async function getPokemon (client) {
  const inventory = await client.getInventory(0)
  return Utils.splitInventory(inventory).pokemon.filter(p => p.is_egg === false)
}

async function changeNicknames (method, user, pass, mode) {
  const client = new Client()
  const token = await new GoogleLogin().login(user, pass)
  client.setAuthInfo('google', token)
  await client.init()
  const pokemon = await getPokemon(client)
  let counter = 0
  
  //merge pokemon names from json file
  for(var i = 0; i < pokemon.length; i++) {
  	for(var j = 0; j < names.length; j++) {
  		if (pokemon[i].pokemon_id == names[j].id) {
  			pokemon[i].name = names[j].name;
			}
  	}
  }

  for (const p of pokemon) {
    const { id, pokemon_id, nickname, individual_attack, individual_defense, individual_stamina, name } = p
    const total = pad2(individual_attack + individual_defense + individual_stamina)
    const stamina = pad2(individual_stamina)
    const attack = pad2(individual_attack)
    const defense = pad2(individual_defense)
    
    //generate nickname based on mode
    if (mode === "raw") {
    	var proposed_nickname = `${total}:${stamina}.${attack}.${defense}`
    } else if (mode === "percentage") {
		  const individual_percentage = truncateDecimals(((individual_stamina + individual_attack + individual_defense) / 45) * 100,0)
		  
		  //truncate name to meet nickname length restrictions
		  var proposed_nickname = pad2(individual_percentage) + ' ' + name.substring(0,8)
    }
    
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
