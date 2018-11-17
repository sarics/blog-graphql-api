import jwt from 'jsonwebtoken';

export const generateToken = ({ id }, expiresIn = '7d') =>
  jwt.sign({ user: { id } }, process.env.JWT_SECRET, { expiresIn });

export const verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);
