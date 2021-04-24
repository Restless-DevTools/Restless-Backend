import axios from 'axios';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import Password from '../helpers/Password';
import UserService from './UserService';

export default class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_KEY;
    this.expirationTime = process.env.JWT_EXPIRATION_TIME;
    this.githubClientId = process.env.GITHUB_CLIENT_ID;
    this.githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.githubRedirectUri = process.env.GITHUB_REDIRECT_URI;
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

  async githubLogin({ code }) {
    try {
      const formData = new FormData();
      formData.append('client_id', this.githubClientId);
      formData.append('client_secret', this.githubClientSecret);
      formData.append('code', code);
      formData.append('redirect_uri', this.githubRedirectUri);

      const { data: urlParams } = await axios.post(
        'https://github.com/login/oauth/access_token',
        formData,
        {
          headers: {
            // eslint-disable-next-line no-underscore-dangle
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          },
        },
      );

      const params = new URLSearchParams(urlParams);
      const accessToken = params.get('access_token');

      const { data: user } = await axios.post('https://api.github.com/user', null, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      const userForToken = {
        status: true,
        username: user.username,
        name: user.name,
      };
      const token = this.generateToken(userForToken);
      return { token, user: userForToken };
    } catch (error) {
      return { message: error.message, status: false };
    }
  }
}
