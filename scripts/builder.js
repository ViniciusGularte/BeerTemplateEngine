  const fse = require('fs-extra')
  const path = require('path')
  const ejs = require('ejs')
  const glob = require('glob')
  const minify = require('html-minifier').minify;

  const config = require('../site.config')
  const dataUser = require('../src/data/user')
  const srcPath = './src'
  const distPath = './public'

  // clear destination folder and make a copy
  fse.emptyDirSync(distPath)
  const filesToAssets = glob.sync('**/*.@(main.css|jpg)', { cwd: `${srcPath}/assets` })
  filesToAssets.forEach((file) =>{
    fse.copySync(`${srcPath}/assets/${file}`, `${distPath}/assets/${file}`)
  })
  // read pages
  const files = glob.sync('**/*.ejs', { cwd: `${srcPath}/pages` });
  files.forEach((file, i) => {
    const fileData = path.parse(file);
    const destPath = path.join(distPath, fileData.dir);

    // create destination directory
    fse.mkdirsSync(destPath);
    // read page file
    const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');
    let pageContent = ejs.render(
      data, Object.assign({}, config,dataUser,{
        filename: `${srcPath}/pages/${file}`
      }
      )
    )
    // render layout with page contents
    const layout = 'default';
    const layoutFileName = `${srcPath}/layouts/${layout}.ejs`;
    const layoutData = fse.readFileSync(layoutFileName, 'utf-8');
    const completePage = ejs.render(
      layoutData,
      Object.assign({}, config, dataUser,{
        body: pageContent,
        filename: layoutFileName
      })
    );
    //Minify the html
    const completePageMinified =  minify(completePage, {
      removeAttributeQuotes: true,
      collapseWhitespace:true
    });
    // save the html file
    fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePageMinified);
  });
