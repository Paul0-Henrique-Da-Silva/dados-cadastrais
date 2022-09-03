const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodemysql','root','',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectou ao Banco')
} catch (err) {
    console.log('Erro ao conectar ao banco', error)
}

module.exports = sequelize
