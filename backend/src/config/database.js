const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_NAME || 'database.sqlite',
  logging: false 
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados!');
  } catch (error) {
    console.error('Erro ao conectar com banco:', error);
  }
};

module.exports = { sequelize, testConnection };