const morgan = require('morgan');
//const prod = NODE_ENV === 'prod' || false;

module.exports = morgan('dev');
