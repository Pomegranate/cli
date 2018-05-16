/**
 * @file build
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const path = require('path')
const Handlebars = require('handlebars')
const fs = require('fs-extra')
const SettingBuilder = require('../Helpers/SettingsBuilder')
const _fp = require('lodash/fp')
const map = _fp.map.convert({cap: false})
const stringifyObject = require('stringify-object');
const EOL = require('os').EOL
const functionSettingsTmpl = path.join(__dirname, '../FrameworkTemplates/build/functionSettings.handlebars')
const objectSettingsTmpl = path.join(__dirname, '../FrameworkTemplates/build/objectSettings.handlebars')

/**
 *
 * @module build
 */

const padObj = obj => {
  let padded = map(function(line, index) {
    if(index > 0) {
      return '  ' + line
    }
    return line
  })(obj.split('\n'))

  return padded.join(EOL)
}

const SingleDefaultConfigs = item => stringifyObject(item[0].defaultOptions, {indent: '  ', singleQuotes: true})

const GroupMultipleConfigs = _fp.compose(_fp.mapValues((item) => {
  return item[0].defaultOptions
}), _fp.groupBy('configName'))

const MultipleDefaultConfigs = (config) => {
  return stringifyObject(GroupMultipleConfigs(config), {indent: '  ', singleQuotes: true})
}

function writeConfig({force, environment, settingsPath, configName, configValues, compiler, cwd}) {
  let namespace = _fp.every('namespace', configValues) ? _fp.first(configValues).namespace : null
  let configPath = namespace ? path.join(settingsPath, namespace ,`${configName}.js`) : path.join(settingsPath, `${configName}.js`)
  return Promise.try(() => {
      return fs.pathExists(configPath)
    })
    .then((configFileExists) => {

      if(!configFileExists || force) {
        if(_fp.some('defaultOptions', configValues)) {

          let multiplePlugin = _fp.some('multiple', configValues)
          let configObject = multiplePlugin ? MultipleDefaultConfigs(configValues) : SingleDefaultConfigs(configValues)
          configObject = environment ? padObj(configObject) : configObject

          let templateData = {
            multiplePlugin,
            configName,
            configObject,
            CreateDate: new Date().toDateString()
          }

          return fs.outputFile(configPath, compiler(templateData))
            .then((res) => {
              console.log(`${path.relative(cwd,configPath)} settings file created.`);
              return res
            })
        }
        return
      }
      console.log(`${path.relative(cwd,configPath)} settings file exists, skipping.`);
    })
}

// The Plugin-Facade handler for this command is responsible for creating plugin workDirs.
module.exports = function buildHandler(args) {
  let CommonModules = args.CommonModules
  let Framework = CommonModules.Framework.module
  let cwd = process.cwd()
  let FrameworkSettings = require(path.join(args.path, 'PomegranateSettings.js'))
  let mergedSettings = SettingBuilder(FrameworkSettings, args.path)
  let packageFile = require(path.join(args.path, 'package.json'))
  let Pom = new Framework(CommonModules)
  let FrameDI = Pom.getInjector('Framework')

  Pom.initialize({packageJSON: packageFile, frameworkOptions: mergedSettings})
    .then((p) => {
      let settingsPath = FrameDI.get('Options').pluginSettingsDirectory.path

      p.runCommand('build', args)
        .then((result) => {
          let templateType = args.environment ? functionSettingsTmpl : objectSettingsTmpl
          return Promise.props({
            settings: _fp.groupBy('parentModule', result),
            compiledTemplate: fs.readFile(templateType, 'utf-8').then(res => Handlebars.compile(res))
          })
        })

        .then((result) => {
          let environment = args.environment
          let force = args.force
          let compiler = result.compiledTemplate
          let writers = map((configValues, configName) => {
            return writeConfig({force, environment, settingsPath, configValues, configName, compiler, cwd})
          })(result.settings)

          return Promise.all(writers)
        })
        .then((result) => {

        })
    })
}