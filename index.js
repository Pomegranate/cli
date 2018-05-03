/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const yargs = require('yargs')
const path = require('path')
const runDirectory = process.cwd()
const pomScript = path.join(runDirectory, 'pom.js')

const semver = require('semver')
const nodeVersion = process.version
const cantRun = !semver.satisfies(nodeVersion, `>=7.6.0`)


if(cantRun){
  throw new Error('Pomegranate v6.x and higher requires NodeJS v7.6 at a minimum.')
  process.exit(1)
}

module.exports = function(CommonModules){
  let args = yargs
    .commandDir('./src/BaseCommands')
    .demandCommand(1, 'You need to provide at least one command.')
    .recommendCommands()
    .help()
    // .wrap(yargs.terminalWidth())
    .parse(process.argv.slice(2), {CommonModules})
    // .argv
}
