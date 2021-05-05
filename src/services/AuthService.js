import axios from 'axios';
import jwt from 'jsonwebtoken';
import Keygenerator from 'keygenerator';
import EmailHelper from '../helpers/EmailHelper';
import FSHelper from '../helpers/FSHelper';
import Logger from '../helpers/Logger';
import Password from '../helpers/Password';
import UserConfirmationService from './UserConfirmationService';
import UserService from './UserService';

export default class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_KEY;
    this.expirationTime = process.env.JWT_EXPIRATION_TIME;
    this.githubClientId = process.env.GITHUB_CLIENT_ID;
    this.githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.githubRedirectUri = process.env.GITHUB_REDIRECT_URI;
    this.githubAccessTokenApi = process.env.GITHUB_ACCESS_TOKEN_API;
    this.githubUserApi = process.env.GITHUB_USER_API;
    this.userService = new UserService();
    this.userConfirmationService = new UserConfirmationService();
    this.emailHelper = new EmailHelper();
    this.fsHelper = new FSHelper();
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

  getUserToken(user) {
    const userForToken = {
      status: true,
      username: user.username,
      name: user.name,
      id: user.id,
    };
    const token = this.generateToken(userForToken);
    return { token, user: userForToken };
  }

  async login(user) {
    const userStored = await this.userService.searchUser(user);
    if (userStored) {
      const passwordCompare = await Password.comparePassword(user.password, userStored.password);
      if (passwordCompare) {
        return this.getUserToken(userStored);
      }
    }
    return { message: 'The current user or password is invalid', status: false };
  }

  async githubLogin({ code }) {
    try {
      const dataToSend = {
        code,
        client_id: this.githubClientId,
        client_secret: this.githubClientSecret,
        redirect_uri: this.githubRedirectUri,
      };

      const { data: urlParams } = await axios.post(
        this.githubAccessTokenApi,
        dataToSend,
      );

      const params = new URLSearchParams(urlParams);
      const accessToken = params.get('access_token');

      const { data: user } = await axios.post(this.githubUserApi, null, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      const userStored = await this.userService.searchUser({ username: user.login, github: true });

      if (!userStored) {
        const userToCreate = {
          name: user.name,
          username: user.login,
          email: user.email,
          github: true,
        };

        const createdUser = await this.userService.create(userToCreate);

        if (!createdUser.id) {
          return {
            message: 'Github username or email already taken! Please register manually.',
            status: false,
          };
        }

        return this.getUserToken(createdUser);
      }

      return this.getUserToken(userStored);
    } catch (error) {
      return { message: error.message, status: false };
    }
  }

  async requestRecoverPassword(userConfirmation) {
    try {
      const userStored = await this.userService.searchUser(userConfirmation);

      if (userStored) {
        const userConfirmationStored = await this.userConfirmationService
          .searchUserConfirmation(userConfirmation);

        const verificationCode = Keygenerator.number({
          length: 6,
        });

        if (!userConfirmationStored) {
          const userConfirmationToBeCreated = { ...userConfirmation, verificationCode };
          await this.userConfirmationService.create(userConfirmationToBeCreated);
        } else {
          await this.userConfirmationService
            .edit(userConfirmationStored.id, { verificationCode, validated: false });
        }

        let html = await this.fsHelper.readFile('./src/layouts/recover-password.html', 'utf8');
        html = html.replace('{username}', userStored.username);
        html = html.replace('{verificationCode}', verificationCode);

        const mail = {
          email: userStored.email,
          subject: 'Restless - Recover password',
          body: html,
          html: true,
        };

        this.emailHelper.createEmail(mail);
      }
      return { message: 'If the user exists an email will be sended' };
    } catch (error) {
      Logger.printError(error);
      return { message: 'Service unavailable' };
    }
  }

  async recoverPassword(recoverData) {
    try {
      const userConfirmation = await this
        .userConfirmationService.searchUserConfirmation(recoverData);

      if (userConfirmation) {
        const { id, username, email } = userConfirmation;

        const userStored = await this.userService.searchUser({ username, email });

        if (userStored) {
          const updatedUser = await this.userService
            .edit(userStored.id, { password: recoverData.password });

          if (updatedUser) {
            this.userConfirmationService.edit(id, { validated: true });

            let html = await this.fsHelper.readFile('./src/layouts/password-updated.html', 'utf8');
            html = html.replace('{username}', userStored.username);

            const mail = {
              email: userStored.email,
              subject: 'Restless - Password updated',
              body: html,
              html: true,
            };

            this.emailHelper.createEmail(mail);

            return { status: true };
          }
        }
      }

      return { status: false };
    } catch (error) {
      Logger.printError(error);
      return { message: 'Service unavailable' };
    }
  }
}
