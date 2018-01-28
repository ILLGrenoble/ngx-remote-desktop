switch (process.env.NODE_ENV) {
    case 'development':
    default:
      module.exports = require('./config/webpack.dev')({env: 'development'});
  }
