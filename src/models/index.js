import Sequelize from 'sequelize';
import Console from 'console';
// models
import Team from './Team';
import User from './User';
import UserTeam from './UserTeam';
import Collection from './Collection';
import Group from './Group';
import Request from './Request';
import RequestBody from './RequestBody';
import RequestHeader from './RequestHeader';
import RequestQuery from './RequestQuery';
import Response from './Response';
import Snippet from './Snippet';

// configs
import {
  host, username, password, database, dialect, port, storage,
} from '../config/database';

const databaseUrl = `${dialect}://${username}:${password}@${host}:${port}/${database}`;

const sequelize = new Sequelize(databaseUrl, {
  dialect,
  underscored: true,
  freezeTableName: true,
  logging: process.env.NODE_ENV !== 'test' && process.env.DATABASE_DEBUG !== 'false',
  storage,
  pool: {
    max: 7,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
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
  Team: Team.init(sequelize, Sequelize),
  User: User.init(sequelize, Sequelize),
  UserTeam: UserTeam.init(sequelize, Sequelize),
  Collection: Collection.init(sequelize, Sequelize),
  Group: Group.init(sequelize, Sequelize),
  Request: Request.init(sequelize, Sequelize),
  RequestBody: RequestBody.init(sequelize, Sequelize),
  RequestHeader: RequestHeader.init(sequelize, Sequelize),
  RequestQuery: RequestQuery.init(sequelize, Sequelize),
  Response: Response.init(sequelize, Sequelize),
  Snippet: Snippet.init(sequelize, Sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize,
};

export default db;
