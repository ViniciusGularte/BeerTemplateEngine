const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const ejsRenderFile = promisify(require('ejs').renderFile)
const globP = promisify(require('glob'))
const config = require('../site.config')
const dataUser = require('../src/data/user')
const minify = require('html-minifier').minify;

const srcPath = './src'
const distPath = './public'

// clear destination folder
fse.emptyDirSync(distPath)

// copy assets folder
fse.copy(`${srcPath}/assets`, `${distPath}/assets`)

// read page templates
globP('**/*.ejs', { cwd: `${srcPath}/pages` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      let pageContent;
      // create destination directory
      fse.mkdirs(destPath)
        .then(() => {
          // render page
          return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, config,dataUser))
        })
        .then((pageContents) => {
          // render layout with page contents
          return ejsRenderFile(`${srcPath}/layouts/default.ejs`, Object.assign({}, config,dataUser, { body: pageContents }))
        })
        .then((layoutContent) => {
          // save the html file
          layoutContent =  minify(layoutContent, {
            removeAttributeQuotes: true,
            collapseWhitespace:true
          });
          fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })
