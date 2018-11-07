import bcrypt from 'bcryptjs';

import { generateToken } from '../utils/jwt';
import getUserId from '../utils/getUserId';

export default {
  async login(parent, { data }, { db }, info) {
    const user = await db.User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('Unable to login.');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error('Unable to login.');
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async createUser(parent, { data }, { db }, info) {
    const user = await db.User.create(data);

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async updateUser(parent, { data }, { request, db }, info) {
    const userId = getUserId(request);
    const user = await db.User.findByPk(userId);

    return user.update(data);
  },
  async deleteUser(parent, args, { request, db }, info) {
    const userId = getUserId(request);
    const user = await db.User.findByPk(userId);

    await user.destroy();

    return user;
  },

  createPost(parent, { data }, { request, db }, info) {
    const userId = getUserId(request);

    return db.Post.create({
      ...data,
      authorId: userId,
    });
  },
  async updatePost(parent, { id, data }, { request, db }, info) {
    const userId = getUserId(request);
    const post = await db.Post.findOne({
      where: {
        id,
        authorId: userId,
      },
    });

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

    return post.update(data);
  },
  async deletePost(parent, { id }, { request, db }, info) {
    const userId = getUserId(request);
    const post = await db.Post.findOne({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!post) {
      throw new Error('Post not found.');
    }

    await post.destroy();

    return post;
  },

  createComment(parent, { data }, { request, db }, info) {
    const userId = getUserId(request);

    return db.Comment.create({
      ...data,
      authorId: userId,
    });
  },
  async updateComment(parent, { id, data }, { request, db }, info) {
    const userId = getUserId(request);
    const comment = await db.Comment.findOne({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!comment) {
      throw new Error('Comment not found.');
    }

    return comment.update(data);
  },
  async deleteComment(parent, { id }, { request, db }, info) {
    const userId = getUserId(request);
    const comment = await db.Comment.findOne({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!comment) {
      throw new Error('Comment not found.');
    }

    await comment.destroy();

    return comment;
  },
};
