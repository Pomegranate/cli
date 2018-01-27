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

module.exports = function(Framework){
  let args = yargs
    .commandDir('./src/BaseCommands')
    .demandCommand(1, 'You need to provide at least one command.')
    .recommendCommands()
    .help()
    // .wrap(yargs.terminalWidth())
    .parse(process.argv.slice(2), {framework: Framework})
    // .argv
}
