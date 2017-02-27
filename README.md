# IV Nickname for Pokemon GO
Change nicknames of all your Pokemon to their respective IVs

![screenshot](/screenshot.png?raw=true)

# Usage
- Get the latest [NodeJS](https://nodejs.org) (v7.6.0 min)
- Download [this repo](https://github.com/frontsideair/iv-nickname/archive/master.zip) and extract zip
- Open terminal (`cmd` on Windows) and `cd` into the extracted folder
- Run `npm install`
- Two nicknaming modes: "raw" for original "total:stam.att.def" format, "percentage" for "%%% Name" format.
- Run `USER=<your_username> PASS=<your_password> MODE=<mode_choice> node index.js` (or `set USER=<your_username>&& set PASS=<your_password>&& set MODE=<mode_choice>&& node index.js` on Windows)

# Caveats/TODOs

- [ ] Reset and override options
- [ ] Favoriting >40 IV total so you don't transfer good pokemon accidentally
- [ ] PTC login
- [ ] Windows support for envvars suck, get login info from command line options or config file
- [X] Different format options for nickname (percentage?)

# Credits

* Pokemon list by [sysopmatt](https://github.com/sysopmatt)
* [pogobuf](https://github.com/cyraxx/pogobuf) library by [Andreas Reich](https://github.com/cyraxx)
