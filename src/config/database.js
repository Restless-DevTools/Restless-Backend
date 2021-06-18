import { format } from 'date-fns';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const testsSqliteFilename = `database-${format(new Date(), 'MM-dd-yyyy-hh:mm:ss')}`;

module.exports = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: process.env.DATABASE_DIALECT,
  port: process.env.DATABASE_PORT,
  storage: `./__tests__/${testsSqliteFilename}.sqlite`,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
