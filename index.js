#!/usr/bin/env node

const { login, changeNicknames } = require('./api')

async function main () {
  try {
    const client = await login('google', process.env.USER, process.env.PASS)
    await changeNicknames(client)
  } catch (e) {
    console.error(e.name + ': ' + e.message)
  }
}

main()
