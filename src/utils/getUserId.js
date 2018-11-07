import { verifyToken } from './jwt';

export default (request, requireAuth = true) => {
  const authHeader = request.request.headers.authorization;
  if (!authHeader) {
    if (requireAuth) throw new Error('Authentication required.');
    return null;
  }

  try {
    const token = authHeader.replace(/^Bearer /, '');
    const { userId } = verifyToken(token);

    return userId || null;
  } catch (err) {
    if (requireAuth) throw err;
    return null;
  }
};
