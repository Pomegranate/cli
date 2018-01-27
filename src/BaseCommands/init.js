/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const initHandler = require('../Handlers/init')
const path = require('path')
module.exports = {
  command: 'init',
  aliases: 'i',
  desc: 'Initializes a new Pomegranate application.',
  builder: function initBuilder(yargs){
    let cwd = process.cwd()
    let appName
    try {
      appName = require(path.join(cwd, 'package.json')).name
    }
    catch(err){
      appName = 'My App'
      // let noPkg = /Cannot find module/
      // let r = noPkg.test(err.message)
      // if(r){
      //   console.log('Error: pomegranate init can only be ran in a directory with a package.json file.');
      //   process.exit(1)
      // }
    }


    return yargs
      .positional('name', {
        description: 'App name, default: package.json name, if available.',
        default: appName,
        type: 'string'
      })
      .options('force', {
        alias: 'f',
        description: 'Overwrite existing files.',
        default: false,
        boolean: true
      })
      .option('path', {
        alias: 'p',
        description: 'Creation path',
        default: cwd,
        defaultDescription: 'process.cwd()',
        string: true
      })
      .usage('Usage: $0 init [name]')
  },
  handler: initHandler
}