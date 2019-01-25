const config = require('./user')
require('dotenv').config();
module.exports = {
  site: {
    description: 'Micro Static Site Generator in Node.js',
    author:'Vinicius Gularte',
    footer:'BeerTemplate',
    basePath: process.env.NODE_ENV === 'production' ? '' : `https://${config.user.site_name}.surge.sh`,
  }
};
