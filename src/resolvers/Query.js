import getUserId from '../utils/getUserId';

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

  async posts(parent, args, ctx, info) {
    const { search, all } = args;
    const { request, db } = ctx;
    const userId = getUserId(request, false);

    const query = db.Post.query().paginated(args);

    if (search) {
      query.where(qb => {
        qb.where('title', 'ilike', `%${search}%`).orWhere(
          'body',
          'ilike',
          `%${search}%`,
        );
      });
    }

    if (all && userId) {
      query.where(qb => {
        qb.where('published', true).orWhereExists(
          db.Post.relatedQuery('author').findById(userId),
        );
      });
    } else {
      query.where('published', true);
    }

    const posts = await query;

    return posts;
  },
  async post(parent, args, ctx, info) {
    const { id } = args;
    const { request, db } = ctx;
    const userId = getUserId(request, false);

    const query = db.Post.query().findById(id);

    if (userId) {
      query.where(qb => {
        qb.where('published', true).orWhereExists(
          db.Post.relatedQuery('author').findById(userId),
        );
      });
    } else {
      query.where('published', true);
    }

    const post = await query;

    if (!post) {
      throw new Error('Post not found.');
    }

    return post;
  },

  async comments(parent, args, ctx, info) {
    const { db } = ctx;

    const query = db.Comment.query().paginated(args);

    const comments = await query;

    return comments;
  },
};
