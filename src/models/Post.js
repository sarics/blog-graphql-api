import { Model } from 'objection';

import BaseModel from './BaseModel';

const generatePostModel = user =>
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

    static getAll(args) {
      const { search, all } = args;

      const query = Post.query().paginated(args);

      if (search) {
        query.where(qb => {
          qb.where('title', 'ilike', `%${search}%`).orWhere(
            'body',
            'ilike',
            `%${search}%`,
          );
        });
      }

      if (all && user) {
        query.where(qb => {
          qb.where('published', true).orWhereExists(
            Post.relatedQuery('author').findById(user.id),
          );
        });
      } else {
        query.where('published', true);
      }

      return query.execute();
    }

    static getById(id) {
      const query = Post.query()
        .findById(id)
        .throwIfNotFound();

      if (user) {
        query.where(qb => {
          qb.where('published', true).orWhereExists(
            Post.relatedQuery('author').findById(user.id),
          );
        });
      } else {
        query.where('published', true);
      }

      return query.execute();
    }
  };

export default generatePostModel;
