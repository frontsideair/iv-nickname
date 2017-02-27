#!/usr/bin/env node

const changeNicknames = require('./changeNicknames')

changeNicknames('google', process.env.USER, process.env.PASS, process.env.MODE)
