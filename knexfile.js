require('dotenv').config();

const config = {
  client: 'pg',
  migrations: {
    directory: './database/migrations',
  },
};

module.exports = {
  development: {
    ...config,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    debug: true,
    searchPath: ['knex'],
    seeds: {
      directory: './database/seeds',
    },
  },

  production: {
    ...config,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    },
  },
};
