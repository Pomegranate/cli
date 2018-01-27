/**
 * @file SettingsBuilder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const path = require('path')
const _fp = require('lodash/fp')
/**
 *
 * @module SettingsBuilder
 */

module.exports = function(FrameworkOptions, ParentDirectory){

  try {
    var pluginDirPath = path.join(ParentDirectory, FrameworkOptions.pluginDirectory);
  }
  catch(e){
    console.log(e);
    process.exit(1)
  }
  try {
    var applicationDirPath = path.join(ParentDirectory, FrameworkOptions.applicationDirectory);
  }
  catch(e){
    if(e instanceof TypeError){
      console.log('No application directory set falling back to current working directory.')
    }
    applicationDirPath = false;
  }

  let mergeOptions = _fp.compose(
    _fp.merge({
      parentDirectory: ParentDirectory,
      applicationDirectory: path.join(ParentDirectory, FrameworkOptions.applicationDirectory),
      pluginDirectory: path.join(ParentDirectory, FrameworkOptions.pluginDirectory),
      pluginSettingsDirectory: path.join(ParentDirectory, FrameworkOptions.pluginSettingsDirectory),
      commandMode: true
    }),
    _fp.merge({
      prefix: 'pomegranate'
    }),
    _fp.omit(['prefix','applicationDirectory','pluginDirectory', 'pluginSettingsDirectory'])
  )

  // var mergedOptions = _.chain(FrameworkOptions)
  //   .omit('prefix')
  //   .merge({
  //     prefix: 'pomegranate'
  //   })
  //   .merge({
  //     parentDirectory: ParentDirectory,
  //     applicationDirectory: path.join(ParentDirectory, FrameworkOptions.applicationDirectory),
  //     pluginDirectory: path.join(ParentDirectory, FrameworkOptions.pluginDirectory),
  //     pluginSettingsDirectory: path.join(ParentDirectory, FrameworkOptions.pluginSettingsDirectory)
  //   })
  //   .value()
  return mergeOptions(FrameworkOptions)
}