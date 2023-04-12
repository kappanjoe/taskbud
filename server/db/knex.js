const knex = require('knex');
require('dotenv').config();
const config = require('../knexfile')[process.env.NODE_ENV]

module.exports = knex(config);
