/**
 * @file init
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pomegranate-cli
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const Handlebars = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
/**
 *
 * @module init
 */

module.exports = function initHandler(args){
  let startScriptTemplate = path.join(__dirname,'../FrameworkTemplates/init/pomScript.handlebars')
  let settingsScriptTemplate = path.join(__dirname,'../FrameworkTemplates/init/pomSettings.handlebars')
  let startFile = path.join(args.path, 'pom.js')
  let settingsFile = path.join(args.path, 'PomegranateSettings.js')
  let applicationDir = path.join(args.path, 'application')
  let pluginDir = path.join(args.path, 'plugins')
  let pluginSettingsDir = path.join(args.path, 'pluginSettings')

  Promise.props({
    settings:fs.pathExists(settingsFile),
    start: fs.pathExists(startFile)
  })
    .then((exists) => {
      if(!args.force && (exists.start || exists.settings)){
        return {status: 1, message: '\'pom.js and/or PomegranateSettings.js already exist, rerun with -f to overwrite.\''}
      }
      if(args.force){
        console.log('Overwriting init files.');
      }

      return Promise.props({
        settings: fs.readFile(settingsScriptTemplate, 'utf-8'),
        start: fs.readFile(startScriptTemplate, 'utf-8')
      })
        .then((files) => {
          let templateData = {
            AppName: args.name,
            CreateDate: new Date().toDateString()
          }
          return Promise.props({
            settings: Handlebars.compile(files.settings)(templateData),
            start: Handlebars.compile(files.start)(templateData)
          })
        })
        .then((result) => {
          return Promise.all([
            fs.outputFile(startFile, result.start),
            fs.outputFile(settingsFile, result.settings)
          ])
        })
        .then((result) => {
          return Promise.all([
            fs.ensureDir(applicationDir),
            fs.ensureDir(pluginDir),
            fs.ensureDir(pluginSettingsDir),
          ])
        })
        .then((result) => {
          return {status: 0, message: 'Created init files and directories. Run `pomegranate build` to generate plugin settings and plugin directories.'}
        })
        .catch((err) => {
          return {status: 1, message: err.message}
        })
    })
    .then((result) => {
      console.log(result.message);
      process.exit(result.status)
    })

}