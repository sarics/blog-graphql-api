import bcrypt from 'bcryptjs';

import { generateToken } from '../utils/jwt';
import getUserId from '../utils/getUserId';

export default {
  async login(parent, args, ctx, info) {
    const {
      data: { email, password },
    } = args;
    const { db } = ctx;

    const user = await db.User.query().findOne({ email });
    if (!user) {
      throw new Error('Unable to login.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Unable to login.');
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async createUser(parent, args, ctx, info) {
    const { data } = args;
    const { db } = ctx;

    const user = await db.User.query()
      .insert(data)
      .returning('*');

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async updateUser(parent, args, ctx, info) {
    const { data } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    const user = await db.User.query()
      .findById(userId)
      .patch(data)
      .returning('*')
      .first();

    return user;
  },
  async deleteUser(parent, args, ctx, info) {
    const { request, db } = ctx;
    const userId = getUserId(request);

    const user = await db.User.query()
      .findById(userId)
      .delete()
      .returning('*')
      .first();

    return user;
  },

  async createPost(parent, args, ctx, info) {
    const { data } = args;
    const { request, db } = ctx;
    const userId = getUserId(request);

    const createPost = async Post => {
      const post = await Post.query()
        .insert(data)
        .returning('*');

      await post.$relatedQuery('author').relate(userId);

      return post;
    };

    try {
      const post = await db.transaction(db.Post, createPost);
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

    const createComment = async Comment => {
      const comment = await Comment.query()
        .insert(data)
        .returning('*');

      await Promise.all([
        comment.$relatedQuery('author').relate(userId),
        comment.$relatedQuery('post').relate(postId),
      ]);

      return comment;
    };

    try {
      const comment = await db.transaction(db.Comment, createComment);
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
