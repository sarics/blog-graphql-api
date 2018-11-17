import { verifyToken } from './jwt';

export default request => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return null;

  try {
    const token = authHeader.replace(/^Bearer /, '');
    const { user } = verifyToken(token);

    return user || null;
  } catch (err) {
    return null;
  }
};
