const knex = require('knex')({
  client: 'oracledb',
  connection: {
    user: 'carvalho',
    password: 'c5prod2013gc',
    connectString: '(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 172.30.1.15)(PORT = 1521))(CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = CON5PROD_iad18f.zndb.vcndb.oraclevcn.com)))'
  },
  fetchAsString: ["number", "clob"]
})

module.exports = knex