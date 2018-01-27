/**
 * @file start
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const runDirectory = process.cwd()
const path = require('path')
const pomScript = path.join(runDirectory, 'pom.js')

module.exports = {
  command: 'start',
  aliases: '',
  desc: 'Starts a pomegranate application in the current directory',
  handler: function(argv){
    require(pomScript)
  }
}