'use strict';

const cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.STRING(25),
        defaultValue: cuid,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {},
  );

  Comment.associate = function({ User, Post }) {
    Comment.belongsTo(User, { as: 'author' });
    Comment.belongsTo(Post, { as: 'post' });
  };

  return Comment;
};
