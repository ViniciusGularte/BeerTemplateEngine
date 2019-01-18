  const fse = require('fs-extra')
  const path = require('path')
  const ejs = require('ejs')
  const glob = require('glob')
  const config = require('../site.config')
  const dataUser = require('../src/data/user')
  const minify = require('html-minifier').minify;
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

    pageContent = ejs.render(`${srcPath}/pages/${file}`, Object.assign({}, config,dataUser))
    // render layout with page contents
    const layout = 'default';
    const layoutFileName = `${srcPath}/layouts/${layout}.ejs`;
    const layoutData = fse.readFileSync(layoutFileName, 'utf-8');
    const completePage = ejs.render(
      layoutData,
      Object.assign({}, {
        body: pageContent,
        config,
        dataUser
      })
    );
    //Minify the html
    completePage =  minify(completePage, {
      removeAttributeQuotes: true,
      collapseWhitespace:true
    });
    // save the html file
    fse.writeFileSync(`${destPath}/${fileData.name}.html`, completePage);
  });
