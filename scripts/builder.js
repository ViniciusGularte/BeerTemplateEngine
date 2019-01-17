const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const ejsRenderFile = promisify(require('ejs').renderFile)
const globP = promisify(require('glob'))
const config = require('../site.config')
const dataUser = require('../src/data/user')
const minify = require('html-minifier').minify;
const cleanCSS = require('clean-css');
const srcPath = './src'
const distPath = './public'

// clear destination folder
fse.emptyDirSync(distPath)

// copy assets  folder
fse.copySync(`${srcPath}/assets/`, `${distPath}/assets/`)

//Minify css style
const inputCss  = fse.readFileSync(`${srcPath}/assets/css/style.css`,'utf8')
const outputCss = new cleanCSS({format: 'beautify',compatibility: 'ie9'}).minify(inputCss)
fse.writeFileSync(`${distPath}/assets/css/style.css`, outputCss.styles)
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
          // save the html file and minify
          layoutContent =  minify(layoutContent, {
            removeAttributeQuotes: true,
            collapseWhitespace:true
          });

          fse.writeFile(`${distPath}/${fileData.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })
