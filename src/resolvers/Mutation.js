import { generateToken } from '../utils/jwt';

export default {
  async login(parent, args, ctx, info) {
    const { data } = args;
    const { db } = ctx;

    const user = await db.User.login(data);

    return {
      user,
      token: generateToken(user),
    };
  },

  async createUser(parent, args, ctx, info) {
    const { data } = args;
    const { db } = ctx;

    const user = await db.User.create(data);

    return {
      user,
      token: generateToken(user),
    };
  },
  updateUser(parent, args, ctx, info) {
    const { data } = args;
    const { db } = ctx;

    return db.User.update(data);
  },
  deleteUser(parent, args, ctx, info) {
    const { db } = ctx;

    return db.User.delete();
  },

  createPost(parent, args, ctx, info) {
    const { data } = args;
    const { db } = ctx;

    return db.Post.create(data);
  },
  updatePost(parent, args, ctx, info) {
    const { id, data } = args;
    const { db } = ctx;

    return db.Post.update(id, data);
  },
  deletePost(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.Post.delete(id);
  },

  createComment(parent, args, ctx, info) {
    const { data } = args;
    const { db } = ctx;

    return db.Comment.create(data);
  },
  updateComment(parent, args, ctx, info) {
    const { id, data } = args;
    const { db } = ctx;

    return db.Comment.update(id, data);
  },
  deleteComment(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.Comment.delete(id);
  },
};
