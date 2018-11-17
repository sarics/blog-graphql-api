import { Model, transaction } from 'objection';

import BaseModel from './BaseModel';

const createPost = (data, userId) => async Post => {
  const post = await Post.query()
    .insert(data)
    .returning('*');

  await post.$relatedQuery('author').relate(userId);

  return post;
};

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

    static async create(data) {
      if (!user) throw Post.createAuthenticationError();

      try {
        const post = await transaction(Post, createPost(data, user.id));

        return post;
      } catch (err) {
        throw new Error("Post couldn't be created.");
      }
    }

    static update(id, data) {
      if (!user) throw Post.createAuthenticationError();

      return Post.query()
        .findById(id)
        .whereExists(Post.relatedQuery('author').findById(user.id))
        .patch(data)
        .returning('*')
        .first()
        .throwIfNotFound()
        .execute();
    }

    static delete(id) {
      if (!user) throw Post.createAuthenticationError();

      return Post.query()
        .findById(id)
        .whereExists(Post.relatedQuery('author').findById(user.id))
        .delete()
        .returning('*')
        .first()
        .throwIfNotFound()
        .execute();
    }
  };

export default generatePostModel;
