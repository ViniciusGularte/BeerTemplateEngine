
module.exports = {
  site: {
    description: 'Micro Static Site Generator in Node.js',
    author:'Vinicius Gularte',
    footer:'BeerTemplate',
    basePath: process.env.NODE_ENV === 'production' ? '/' : 'https://viniciusgularte.github.io/BeerTemplateEngine',
  },
  build: {
    outputPath: process.env.NODE_ENV === 'production' ? './docs' : './public'
  }
};
