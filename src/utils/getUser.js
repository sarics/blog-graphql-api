import { verifyToken } from './jwt';

export default request => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return null;

  const [, token] = authHeader.match(/^Bearer ([A-Za-z0-9_\-.]+)$/) || [];
  if (!token) return null;

  try {
    const { user } = verifyToken(token);

    return user || null;
  } catch (err) {
    return null;
  }
};
