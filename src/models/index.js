import Sequelize from 'sequelize';
import Console from 'console';
// models

const databaseUrl = process.env.DB_TMS || 'postgres://postgres:postgres!@localhost:5432/restless';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  underscored: true,
  freezeTableName: true,
  logging: process.env.NODE_ENV !== 'test',
});

sequelize
  .authenticate()
  .then(() => {
    Console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    Console.error('Unable to connect to the database:', err);
  });

const models = {
  // Request: TipoDeAlerta.init(sequelize, Sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
};

export default db;
