require('dotenv').config();

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    directory: './database/migrations',
  },
};

module.exports = {
  development: {
    ...config,
    debug: true,
    searchPath: ['dev'],
  },

  test: {
    ...config,
    searchPath: ['test'],
  },

  production: {
    ...config,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    },
  },
};
