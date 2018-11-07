'use strict';

const cuid = require('cuid');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.STRING(25),
        defaultValue: cuid,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          len: [8],
        },
        get() {
          return this.getDataValue('passwordHash');
        },
        set(val) {
          this.setDataValue('password', val);

          const passwordHash = bcrypt.hashSync(val, 10);
          this.setDataValue('passwordHash', passwordHash);
        },
      },
    },
    {},
  );

  User.associate = function({ Post, Comment }) {
    User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' });
    User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });
  };

  return User;
};
