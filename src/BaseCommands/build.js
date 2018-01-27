/**
 * @file build
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const buildHandler = require('../Handlers/build')
const Promise = require('bluebird')
module.exports = {
  command: 'build',
  aliases: 'b',
  desc: 'Generates plugin work directories and settings files.',
  builder: function buildBuilder(yargs){
    let cwd = process.cwd()
    return yargs
      .options('e', {
        alias: 'environment',
        describe: 'Generates plugin setting files that export a function with access to the Environment dependency "Env".',
        default: false,
        type: 'boolean'
      })
      .option('force', {
        alias: 'f',
        description: 'Regenerate configs if they exist.',
        default: false,
        type: 'boolean'
      })
      .option('path', {
        alias: 'p',
        description: 'Application Path',
        default: cwd,
        defaultDescription: 'process.cwd()',
        string: true
      })
  },
  handler: buildHandler
}

function dynamic(yargs) { (async function(){
  return Promise.try(() => {
    let cwd = process.cwd()
    return yargs
      .options('e', {
        alias: 'environment',
        describe: 'Generates plugin setting files that export a function with access to the Environment dependency "Env".',
        default: false,
        type: 'boolean'
      })
      .option('path', {
        alias: 'p',
        description: 'Application Path',
        default: cwd,
        defaultDescription: 'process.cwd()',
        string: true
      })
  })
})().then(result => result) }