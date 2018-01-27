/**
 * @file baseCommands
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const cli = require('../../index')
console.log(cli);

tap.test('Retriving the cli ', (t) => {
  t.ok(true, 'end')
  t.end()
})