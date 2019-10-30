var Sequelize = require('sequelize');

const sequelize = new Sequelize('testdata1', 'postgres', 'postgres', {dialect: 'postgres'});

const models = {
  OpReturn: sequelize.import('./opreturn')
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
module.exports = models;