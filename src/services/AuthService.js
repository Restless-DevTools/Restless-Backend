import axios from 'axios';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import Keygenerator from 'keygenerator';
import Password from '../helpers/Password';
import UserService from './UserService';
import UserConfirmationService from './UserConfirmationService';
import Logger from '../helpers/Logger';
import EmailHelper from '../helpers/EmailHelper';
import FSHelper from '../helpers/FSHelper';

export default class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_KEY;
    this.expirationTime = process.env.JWT_EXPIRATION_TIME;
    this.githubClientId = process.env.GITHUB_CLIENT_ID;
    this.githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.githubRedirectUri = process.env.GITHUB_REDIRECT_URI;
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

  async login(user) {
    const userStored = await this.userService.searchUser(user);
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

      const userStored = await this.userService
        .searchUser({ username: user.login, github: true });

      if (!userStored) {
        const userToCreate = {
          username: user.login,
          name: user.name,
          email: user.email,
          github: true,
        };

        return { status: true, needRegister: true, userToCreate };
      }

      const userForToken = {
        status: true,
        username: userStored.username,
        name: userStored.name,
      };
      const token = this.generateToken(userForToken);
      return { token, user: userForToken };
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
