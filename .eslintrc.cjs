const file = __filename.replace(/\\/g, '/').split('/')
const dirPath = `./plugins/${file[file.length - 2]}`

module.exports = {
  extends: '../../.eslintrc.cjs',
  settings: {
    'import/resolver': {
      alias: [
        ['#Karin', `${dirPath}/lib/imports/index.js`],
        ['#template', `${dirPath}/lib/imports/template.js`]
      ]
    }
  }
}
