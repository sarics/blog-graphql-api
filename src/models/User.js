import { Model } from 'objection';
import bcrypt from 'bcryptjs';

import BaseModel from './BaseModel';

class User extends BaseModel {
  static tableName = 'Users';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'password'],

    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 8 },
    },
  };

  static setRelationMappings({ Post, Comment }) {
    User.relationMappings = {
      posts: {
        relation: Model.ManyToManyRelation,
        modelClass: Post,
        join: {
          from: 'Users.id',
          to: 'Posts.id',
          through: {
            from: 'PostsToUsers.UserId',
            to: 'PostsToUsers.PostId',
          },
        },
      },

      comments: {
        relation: Model.ManyToManyRelation,
        modelClass: Comment,
        join: {
          from: 'Users.id',
          to: 'Comments.id',
          through: {
            from: 'CommentsToUsers.UserId',
            to: 'CommentsToUsers.CommentId',
          },
        },
      },
    };
  }

  $beforeInsert(queryContext) {
    super.$beforeInsert(queryContext);

    this.password = bcrypt.hashSync(this.password, 10);
  }

  $beforeUpdate(opt, queryContext) {
    super.$beforeUpdate(opt, queryContext);

    if (this.password) this.password = bcrypt.hashSync(this.password, 10);
  }
}

export default User;
