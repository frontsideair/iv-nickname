# IV Nickname for Pokemon GO
Change nicknames of all your Pokemon to their respective IVs

![screenshot](/screenshot.png?raw=true)

# Set up

1. Requires NPM.
2. Install dependencies with `npm install`.
3. Run the script with `node index.js` with parameters outlined below.

# Usage
```
Format: (total:stamina.attack.defense)

Options:
  -m, --method   Can be `google` or `ptc`                                                 [required]  [default: "google"]
  -u, --user     Username (command line argument or PG_USER)
  -p, --pass     Password (command line argument or PG_PASS)
  -f, --fave     Pokemon with total IV over this number will be favorited. 0 to disable.  [default: 0]
  -d, --display  Don't change anything, only display Pokemon info.
  -r, --reset    Reset all nicknames.
```

# Roadmap

- [ ] Include move types
- [ ] ???

# Credits

* Move list from [this gist](https://gist.github.com/KazWolfe/68e10ebf1ed41ae1ae6de2350d5de884) by [Kaz Wolfe](https://github.com/KazWolfe)
* Pokemon list from [pokemon-go-iv](https://github.com/billyvg/pokemon-go-iv) by [Billy Vong](https://github.com/billyvg)
* [pogobuf](https://github.com/cyraxx/pogobuf) library by [Andreas Reich](https://github.com/cyraxx)
