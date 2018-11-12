// import withPaginatedQuery from '../utils/withPaginatedQuery';
import getUserId from '../utils/getUserId';

export default {
  me(parent, args, ctx, info) {
    const { request, db } = ctx;
    const userId = getUserId(request, false);
    if (!userId) return null;

    return db.User.query().findById(userId);
  },

  // users: withPaginatedQuery('User')((parent, args, ctx, info) => {
  //   const { search } = args;
  //   const { db, query } = ctx;
  //   const { Op } = db.Sequelize;

  //   if (search) {
  //     query.where[Op.and].push({
  //       name: {
  //         [Op.iLike]: `%${search}%`,
  //       },
  //     });
  //   }

  //   return db.User.findAll(query);
  // }),
  users(parent, args, ctx, info) {
    const { db } = ctx;

    return db.User.query();
  },

  // posts: withPaginatedQuery('Post')((parent, args, ctx, info) => {
  //   const { search, all } = args;
  //   const { request, db, query } = ctx;
  //   const { Op } = db.Sequelize;
  //   const userId = getUserId(request, false);

  //   if (search) {
  //     query.where[Op.and].push({
  //       [Op.or]: [
  //         {
  //           title: {
  //             [Op.iLike]: `%${search}%`,
  //           },
  //         },
  //         {
  //           body: {
  //             [Op.iLike]: `%${search}%`,
  //           },
  //         },
  //       ],
  //     });
  //   }

  //   if (all && userId) {
  //     query.where[Op.and].push({
  //       [Op.or]: [
  //         {
  //           published: true,
  //         },
  //         {
  //           authorId: userId,
  //         },
  //       ],
  //     });
  //   } else {
  //     query.where[Op.and].push({
  //       published: true,
  //     });
  //   }

  //   return db.Post.findAll(query);
  // }),
  posts(parent, args, ctx, info) {
    const { db } = ctx;

    return db.Post.query();
  },
  // async post(parent, { id }, { request, db }, info) {
  //   const { Op } = db.Sequelize;
  //   const userId = getUserId(request, false);
  //   const query = {
  //     where: {
  //       id,
  //     },
  //   };

  //   if (userId) {
  //     query.where[Op.or] = [
  //       {
  //         published: true,
  //       },
  //       {
  //         authorId: userId,
  //       },
  //     ];
  //   } else {
  //     query.where.published = true;
  //   }

  //   const post = await db.Post.findOne(query);

  //   if (post) return post;

  //   throw new Error('Post not found.');
  // },
  async post(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    const post = await db.Post.query().findById(id);
    if (!post) {
      throw new Error('Post not found.');
    }

    return post;
  },

  // comments: withPaginatedQuery('Comment')((parent, args, ctx, info) => {
  //   const { db, query } = ctx;

  //   return db.Comment.findAll(query);
  // }),
  comments(parent, args, ctx, info) {
    const { db } = ctx;

    return db.Comment.query();
  },
};
