export default {
  me(parent, args, ctx, info) {
    const { db } = ctx;

    return db.User.me();
  },

  users(parent, args, ctx, info) {
    const { db } = ctx;

    return db.User.getAll(args);
  },
  user(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.User.getById(id);
  },

  posts(parent, args, ctx, info) {
    const { db } = ctx;

    return db.Post.getAll(args);
  },
  post(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.Post.getById(id);
  },

  comments(parent, args, ctx, info) {
    const { db } = ctx;

    return db.Comment.getAll(args);
  },
  comment(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.Comment.getById(id);
  },
};
