import pkg from './package.json'
import rpi_jsy from 'rollup-plugin-jsy-lite'
import rpi_resolve from 'rollup-plugin-node-resolve'
import { terser as rpi_terser } from 'rollup-plugin-terser'

const sourcemap = true
const plugins_base = [rpi_resolve({modulesOnly: true})]

const plugins_neutral = plugins_base.concat([ rpi_jsy() ])

const plugins_nodejs = plugins_base.concat([
  rpi_jsy({defines: { PLAT_NODEJS: true }}),
])

const plugins_web = plugins_base.concat([
  rpi_jsy({defines: { PLAT_WEB: true }}),
])
const plugins_web_min = plugins_web.concat([
  rpi_terser({}),
])

export default [
  { input: `code/index.jsy`, plugins: plugins_nodejs,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap, exports: 'named' },
      { file: pkg.module, format: 'es', sourcemap }, ]},

  { input: `code/index.jsy`, plugins: plugins_web,
    output: [
      { file: pkg.browser.replace('.min.js','.dbg.js'), format: 'umd', name: pkg.name, sourcemap, exports: 'named' },
      { file: 'esm/browser.js', format: 'es', sourcemap }, ]},

  { input: `code/index.jsy`, plugins: plugins_web_min,
    output: { file: pkg.browser, format: 'umd', name: pkg.name, exports: 'named' }},


  { input: `code/utils.jsy`, plugins: plugins_nodejs,
    output: { file: 'esm/utils.nodejs.js', format: 'es', sourcemap } },
  { input: `code/utils.jsy`, plugins: plugins_web,
    output: { file: 'esm/utils.web.js', format: 'es', sourcemap } },

  { input: `code/gf256.jsy`, plugins: plugins_neutral,
    output: [
      { file: 'cjs/gf256.js', format: 'cjs', sourcemap, exports:'named' },
      { file: 'umd/gf256.js', format: 'umd', sourcemap, exports:'named', name: 'gf256' },
      { file: 'esm/gf256.js', format: 'es', sourcemap }, ]},


  { input: `test/unittest.jsy`, context: 'window', plugins: plugins_web,
    output: { file: 'test/__unittest.iife.js', format: 'iife', name: `test_${pkg.name.replace(/-/g,'_')}`, sourcemap } },

  { input: `test/unittest.jsy`, plugins: plugins_nodejs,
    output: { file: 'test/__unittest.cjs.js', format: 'cjs', sourcemap } },

].filter(Boolean)
