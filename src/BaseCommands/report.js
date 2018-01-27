/**
 * @file report
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

module.exports = {
  command: 'report',
  aliases: '',
  desc: 'Pomegranate plugin specific commands.',
  builder: function initBuilder(yargs){
  },
  handler: function(argv){
    console.log(this);
    console.log('Do it', argv);
  }
}