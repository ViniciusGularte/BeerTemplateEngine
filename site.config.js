
module.exports = {
  site: {
    description: 'Micro Static Site Generator in Node.js',
    author:'Vinicius Gularte',
    footer:'BeerTemplate',
    basePath: process.env.NODE_ENV === 'production' ? '/' : 'www.viniciusgularte.github.io/BeerTemplate/',
  },
  build: {
    outputPath: process.env.NODE_ENV === 'production' ? './docs' : './public'
  }
};
