'use strict';

var _require = require('pogobuf');

var PTCLogin = _require.PTCLogin;
var GoogleLogin = _require.GoogleLogin;
var Client = _require.Client;
var _require$Utils = _require.Utils;
var splitInventory = _require$Utils.splitInventory;
var getIVsFromPokemon = _require$Utils.getIVsFromPokemon;

var optimist = require('optimist');

var MOVES = require('./moves');
var POKEMON = require('./pokemon');

var _process$env = process.env;
var PROVIDER = _process$env.PROVIDER;
var PG_USER = _process$env.PG_USER;
var PG_PASS = _process$env.PG_PASS;


var argv = optimist.usage('Change nicknames of all your Pokemon to their respective IVs.\nFormat: (total:stamina.attack.defense)').demand('m', 'u', 'p', 'f').alias('m', 'method').alias('u', 'user').alias('p', 'pass').alias('f', 'fave').alias('d', 'display').alias('r', 'reset').describe('m', 'Can be `google` or `ptc`').describe('u', 'Username (command line argument or PG_USER)').describe('p', 'Password (command line argument or PG_PASS)').describe('f', 'Pokemon with total IV over this number will be favorited. 0 to disable.').describe('d', 'Don\'t change anything, only display Pokemon info.').describe('r', 'Reset all nicknames.').default('m', 'google').default('u', PG_USER).default('p', PG_PASS).default('f', 0).argv;

function pad2(num) {
  return (num < 10 ? '0' : '') + num;
}

var client = new Client();
var provider = argv.method === 'google' ? new GoogleLogin() : new PTCLogin();

if (!argv.user || !argv.pass) {
  optimist.showHelp();
} else {
  var promise = provider.login(argv.user, argv.pass).then(function (token) {
    client.setAuthInfo(argv.method, token);

    return client.init();
  }).then(function () {
    return client.getInventory(0);
  }).then(function (inventory) {
    if (!inventory.success) {
      throw new Error('Inventory could not be retrieved.');
    }

    var _splitInventory = splitInventory(inventory);

    var pokemon = _splitInventory.pokemon;

    var pokemonDetails = pokemon.filter(function (poke) {
      return poke.pokemon_id;
    }).map(function (poke) {
      var ivs = getIVsFromPokemon(poke);
      var details = POKEMON[poke.pokemon_id - 1];
      var move_1 = MOVES[poke.move_1];
      var move_2 = MOVES[poke.move_2];

      return {
        number: poke.pokemon_id,
        name: details.name,
        nickname: poke.nickname,
        cp: poke.cp,
        moves: [{ name: move_1.name, dps: move_1.dps }, { name: move_2.name, dps: move_2.dps, charge: move_2.charge }],
        iv: {
          total: ivs.stam + ivs.att + ivs.def,
          stamina: ivs.stam,
          attack: ivs.att,
          defense: ivs.def
        },
        fave: poke.favorite,
        uuid: poke.id
      };
    });

    return pokemonDetails.sort(function (a, b) {
      return b.iv.total - a.iv.total;
    });
  });

  if (argv.display) {
    promise.then(function (pokemon) {
      console.log(JSON.stringify(pokemon, null, 2));
    });
  } else {
    promise.then(function (pokemon) {
      client.batchStart();

      pokemon.forEach(function (poke) {
        var IVnickname = pad2(poke.iv.total) + ':' + pad2(poke.iv.stamina) + '.' + pad2(poke.iv.attack) + '.' + pad2(poke.iv.defense);
        var nickname = argv.reset ? '' : IVnickname;

        if (poke.nickname !== nickname) {
          client.nicknamePokemon(poke.uuid, nickname);
        }

        if (!argv.reset && argv.fave != 0 && poke.iv >= argv.fave && !poke.fave) {
          client.setFavoritePokemon(poke.uuid, true);
        }
      });

      return client.batchCall();
    }).then(function () {
      console.log('Nicknames changed successfully!');
    });
  }

  promise.catch(console.error);
}