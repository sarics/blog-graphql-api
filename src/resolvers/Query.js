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

  async comments(parent, args, ctx, info) {
    const { db } = ctx;

    const query = db.Comment.query().paginated(args);

    const comments = await query;

    return comments;
  },
};
