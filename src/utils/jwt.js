import jwt from 'jsonwebtoken';

export const generateToken = userId =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);
