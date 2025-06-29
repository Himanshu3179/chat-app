import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/user.model';

/**
 * Generates a JSON Web Token for a user.
 * @param user - The user object to create a token for.
 * @returns The generated JWT.
 */
export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, config.jwt_secret, {
    expiresIn: '30d', // Token will expire in 1 day
  });

  return token;
};
