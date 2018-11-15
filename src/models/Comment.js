import { Model } from 'objection';

import BaseModel from './BaseModel';

class Comment extends BaseModel {
  static tableName = 'Comments';

  static jsonSchema = {
    type: 'object',
    required: ['text'],

    properties: {
      id: { type: 'string' },
      text: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  static setRelationMappings({ User, Post }) {
    Comment.relationMappings = {
      author: {
        relation: Model.HasOneThroughRelation,
        modelClass: User,
        join: {
          from: 'Comments.id',
          to: 'Users.id',
          through: {
            from: 'CommentsToUsers.CommentId',
            to: 'CommentsToUsers.UserId',
          },
        },
      },

      post: {
        relation: Model.HasOneThroughRelation,
        modelClass: Post,
        join: {
          from: 'Comments.id',
          to: 'Posts.id',
          through: {
            from: 'CommentsToPosts.CommentId',
            to: 'CommentsToPosts.PostId',
          },
        },
      },
    };
  }
}

export default Comment;
