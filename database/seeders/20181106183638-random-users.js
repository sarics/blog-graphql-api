'use strict';

const cuid = require('cuid');
const bcrypt = require('bcryptjs');

const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomName = (minLength = 5, maxLength = 15) => {
  const length = randomInt(minLength, maxLength);

  let name = '';
  for (let i = 0; i < length; i++) {
    const char = chars[randomInt(0, chars.length - 1)];
    name += char;
  }

  return name;
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];
    for (let i = 0; i < 100; i++) {
      const name = getRandomName();

      users.push({
        id: cuid(),
        name,
        email: `${name}@example.com`,
        passwordHash: bcrypt.hashSync('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
