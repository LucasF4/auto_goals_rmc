const express = require('express')
const moment = require('moment')
const app = express()
const PORT = 1999
const baseUrl = 'https://rmcweb.gruporcarvalho.com.br'

const knex = require('./Database/connection')

// Verifica se o servidor está funcionando.
app.get('/teste', async (req, res) => {
  await knex.raw(`SELECT * FROM GCTI.CARVALHO_DADOS_MARGEM_METARMC WHERE DATA = '${moment().format('YYYY-MM')}'`)
  .then(() => {
    res.send('Database and Server is working!<br>Response router: ' + baseUrl + ':' + PORT + req.url)
  })
  .catch(err => {
    res.send('Something went wrong!<br>Error Description Database: ' + err + '<br>Response Router: ' + baseUrl + ':' + PORT + req.url)
  })
})

setInterval(async function(){

  var diaHoje = moment().format('DD')
  var mesHoje = moment().format('MM')
  var anoHoje = moment().format('YYYY')
  console.log(diaHoje + '/' + mesHoje + '/' + anoHoje)

  // Verifica qual dia da semana estamos.
  
  if(diaHoje == '01'){
    //Se for dia 01, ele verificará se contém os dados no banco para fazer o insert.
    console.log('Rodando Instrução com a data: ' + moment().format('YYYY-MM'))

    var sql = `SELECT * 
      FROM GCTI.CARVALHO_DADOS_MARGEM_METARMC
      WHERE DATA = '${moment().format('YYYY-MM')}'`;

    var select = await knex.raw(sql)
    console.log(sql)
    console.log(select.length)

    //Essa verificação serve porque o evento é executado no período de 12 horas no dia (Duas vezes no dia).
    if(select.length == 0){
      //Se os dados naõ tiverem sido inseridos, ele fará a inserção dos dados.
      console.log('[!] Preparando o INSERT')

      //------------------------------------------------------------------------------------------------------
      //                              >>>>> Exemplo do INSERT que deverá ser feito <<<<<
      // insert into GCTI.CARVALHO_DADOS_MARGEM_METARMC
      // SELECT meta, '2022-12', loja FROM GCTI.CARVALHO_DADOS_MARGEM_METARMC
      // WHERE DATA = '2022-11'
      // -----------------------------------------------------------------------------------------------------

      await knex.raw(`
        INSERT INTO GCTI.CARVALHO_DADOS_MARGEM_METARMC
          SELECT meta, '${moment().format('YYYY-MM')}', loja FROM GCTI.CARVALHO_DADOS_MARGEM_METARMC
        WHERE DATA = '${moment().subtract(1, 'month').format('YYYY-MM')}'
      `).then(() => {
        console.log('[!] DADOS INSERIDOS COM SUCESSO!')
      })
      .catch(err => {
        console.log('Ocorreu um erro: ' + err)
      })
    }else{
      //Se tiver os dados já inseridos, ele irá ignorar.
      console.log('~> Não faço o insert <~')
    }
    
  }else{
    //Enquanto o dia não for o primeiro do mês, ele não fará nenhum processo.
    console.log('Ainda não...')
    return 0;
  }

}, 43200000)
//43200000 = 12 horas

app.use(function(req, res, next){
  res.status(400).send(`Page ":${baseUrl}:${PORT}${req.url}" not found!`)
})

app.listen(PORT, () => {
  console.log(`
  ----------------------------------------------------------------------
  |\tServer running in: ${baseUrl}:${PORT}
  |
  |\tAuthor: Lucas Félix
  |\tCopyright © 2022: R Carvalho - RMC COMERCIO DE ALIMENTOS LTDA
  |\tAll Rights Reserved
  |
  |\tFor more informations, contact those responsible.
  |\tApplication started
  ----------------------------------------------------------------------
  `)
})