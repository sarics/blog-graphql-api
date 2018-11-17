import { Model } from 'objection';
import bcrypt from 'bcryptjs';

import BaseModel from './BaseModel';

export default user =>
  class User extends BaseModel {
    static tableName = 'Users';

    static jsonSchema = {
      type: 'object',
      required: ['name', 'email', 'password'],

      properties: {
        id: { type: 'string' },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        email: {
          type: 'string',
          format: 'email',
          minLength: 1,
          maxLength: 255,
        },
        password: {
          type: 'string',
          minLength: 8,
        },
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

    static getAll(args) {
      const { search } = args;

      const query = User.query().paginated(args);

      if (search) {
        query.where('name', 'ilike', `%${search}%`);
      }

      return query.execute();
    }

    static getById(id) {
      return User.query()
        .findById(id)
        .throwIfNotFound()
        .execute();
    }

    static create(data) {
      return User.query()
        .insert(data)
        .returning('*')
        .execute();
    }

    static update(data) {
      if (!user) throw User.createAuthenticationError();

      return User.query()
        .findById(user.id)
        .patch(data)
        .returning('*')
        .first()
        .throwIfNotFound()
        .execute();
    }

    static delete() {
      if (!user) throw User.createAuthenticationError();

      return User.query()
        .findById(user.id)
        .delete()
        .returning('*')
        .first()
        .throwIfNotFound()
        .execute();
    }

    static me() {
      if (!user) throw User.createNotFoundError();

      return User.getById(user.id);
    }

    static async login(data) {
      const { email, password } = data;

      const userItem = await User.query()
        .findOne({ email })
        .throwIfNotFound();

      const passwordMatch = bcrypt.compareSync(password, userItem.password);
      if (!passwordMatch) {
        throw User.createNotFoundError();
      }

      return userItem;
    }

    $beforeInsert(queryContext) {
      super.$beforeInsert(queryContext);

      this.password = bcrypt.hashSync(this.password, 10);
    }

    $beforeUpdate(opt, queryContext) {
      super.$beforeUpdate(opt, queryContext);

      if (this.password) this.password = bcrypt.hashSync(this.password, 10);
    }

    getPosts(args) {
      return this.$relatedQuery('posts')
        .paginated(args)
        .execute();
    }

    getComments(args) {
      return this.$relatedQuery('comments')
        .paginated(args)
        .execute();
    }
  };
