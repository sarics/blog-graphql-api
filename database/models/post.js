'use strict';

const cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.STRING(25),
        defaultValue: cuid,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {},
  );

  Post.associate = function({ User, Comment }) {
    Post.belongsTo(User, { as: 'author' });
    Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
  };

  return Post;
};
