import { Model } from 'objection';

import BaseModel from './BaseModel';

class Post extends BaseModel {
  static tableName = 'Posts';

  static jsonSchema = {
    type: 'object',
    required: ['title', 'body', 'published'],

    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      body: { type: 'string', minLength: 1 },
      published: { type: 'boolean' },
    },
  };

  static setRelationMappings({ User, Comment }) {
    Post.relationMappings = {
      author: {
        relation: Model.HasOneThroughRelation,
        modelClass: User,
        join: {
          from: 'Posts.id',
          to: 'Users.id',
          through: {
            from: 'PostsToUsers.PostId',
            to: 'PostsToUsers.UserId',
          },
        },
      },

      comments: {
        relation: Model.ManyToManyRelation,
        modelClass: Comment,
        join: {
          from: 'Posts.id',
          to: 'Comments.id',
          through: {
            from: 'CommentsToPosts.PostId',
            to: 'CommentsToPosts.CommentId',
          },
        },
      },
    };
  }
}

export default Post;
