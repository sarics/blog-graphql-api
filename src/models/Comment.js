import { Model, transaction } from 'objection';

import BaseModel from './BaseModel';

const createComment = (data, userId, postId) => async Comment => {
  const comment = await Comment.query()
    .insert(data)
    .returning('*');

  await Promise.all([
    comment.$relatedQuery('author').relate(userId),
    comment.$relatedQuery('post').relate(postId),
  ]);

  return comment;
};

const generateCommentModel = user =>
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

    static getAll(args) {
      return Comment.query()
        .paginated(args)
        .execute();
    }

    static getById(id) {
      return Comment.query()
        .findById(id)
        .throwIfNotFound()
        .execute();
    }

    static async create({ postId, ...data }) {
      if (!user) throw Comment.createAuthenticationError();

      try {
        const comment = await transaction(
          Comment,
          createComment(data, user.id, postId),
        );

        return comment;
      } catch (err) {
        throw new Error("Comment couldn't be created.");
      }
    }

    static update(id, data) {
      if (!user) throw Comment.createAuthenticationError();

      return Comment.query()
        .findById(id)
        .whereExists(Comment.relatedQuery('author').findById(user.id))
        .patch(data)
        .returning('*')
        .first()
        .throwIfNotFound()
        .execute();
    }

    static delete(id) {
      if (!user) throw Comment.createAuthenticationError();

      return Comment.query()
        .findById(id)
        .whereExists(Comment.relatedQuery('author').findById(user.id))
        .delete()
        .returning('*')
        .first()
        .throwIfNotFound()
        .execute();
    }

    getAuthor() {
      return this.$relatedQuery('author').execute();
    }

    getPost() {
      return this.$relatedQuery('post').execute();
    }
  };

export default generateCommentModel;
