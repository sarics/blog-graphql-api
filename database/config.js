const config = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  operatorsAliases: false,
};

module.exports = {
  development: {
    ...config,
    benchmark: true,
  },
  production: {
    ...config,
    dialectOptions: {
      ssl: true,
    },
  },
};
