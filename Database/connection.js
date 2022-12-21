const knex = require('knex')({
  client: '',
  connection: {
    user: '',
    password: '',
    connectString: ''
  },
  fetchAsString: ["number", "clob"]
})

module.exports = knex
