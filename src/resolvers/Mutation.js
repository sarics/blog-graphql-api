import { generateToken } from '../utils/jwt';
import getUserId from '../utils/getUserId';

const createPost = (data, userId) => async Post => {
  const post = await Post.query()
    .insert(data)
    .returning('*');

  await post.$relatedQuery('author').relate(userId);

  return post;
};

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

  async createPost(parent, args, ctx, info) {
    const { data } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    try {
      const post = await db.transaction(db.Post, createPost(data, userId));

      return post;
    } catch (err) {
      throw new Error("Post couldn't be created.");
    }
  },
  async updatePost(parent, args, ctx, info) {
    const { id, data } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    const post = await db.Post.query()
      .findById(id)
      .whereExists(db.Post.relatedQuery('author').findById(userId))
      .patch(data)
      .returning('*')
      .first();

    if (!post) {
      throw new Error('Post not found.');
    }

    // if (post.published && data.published === false) {
    //   await prisma.mutation.deleteManyComments({
    //     where: {
    //       post: {
    //         id,
    //       },
    //     },
    //   });
    // }

    return post;
  },
  async deletePost(parent, args, ctx, info) {
    const { id } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    const post = await db.Post.query()
      .findById(id)
      .whereExists(db.Post.relatedQuery('author').findById(userId))
      .delete()
      .returning('*')
      .first();

    if (!post) {
      throw new Error('Post not found.');
    }

    return post;
  },

  async createComment(parent, args, ctx, info) {
    const {
      data: { postId, ...data },
    } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    try {
      const comment = await db.transaction(
        db.Comment,
        createComment(data, userId, postId),
      );

      return comment;
    } catch (err) {
      throw new Error("Comment couldn't be created.");
    }
  },
  async updateComment(parent, args, ctx, info) {
    const { id, data } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    const comment = await db.Comment.query()
      .findById(id)
      .whereExists(db.Comment.relatedQuery('author').findById(userId))
      .patch(data)
      .returning('*')
      .first();

    if (!comment) {
      throw new Error('Comment not found.');
    }

    return comment;
  },
  async deleteComment(parent, args, ctx, info) {
    const { id } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    const comment = await db.Comment.query()
      .findById(id)
      .whereExists(db.Comment.relatedQuery('author').findById(userId))
      .delete()
      .returning('*')
      .first();

    if (!comment) {
      throw new Error('Comment not found.');
    }

    return comment;
  },
};
