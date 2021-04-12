import jwt from 'jsonwebtoken';
import Password from '../helpers/Password';
import UserService from './UserService';

export default class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_KEY;
    this.expirationTime = process.env.JWT_EXPIRATION_TIME;
    this.userService = new UserService();
  }

  generateToken(user) {
    return jwt.sign({ user }, this.secretKey, { expiresIn: this.expirationTime });
  }

  validateToken(token) {
    return jwt.verify(token, this.secretKey, (err, decoded) => {
      if (err) {
        return null;
      }
      return decoded;
    });
  }

  async login(user) {
    const userStored = await this.userService.getUserByUsername(user.username);
    if (userStored) {
      const passwordCompare = await Password.comparePassword(user.password, userStored.password);
      if (passwordCompare) {
        const userForToken = {
          status: true,
          username: userStored.username,
          name: userStored.name,
        };
        const token = this.generateToken(userForToken);
        return { token, user: userForToken };
      }
    }
    return { message: 'The current user or password is invalid', status: false };
  }
}
