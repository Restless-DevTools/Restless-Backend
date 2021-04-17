import jwt from 'jsonwebtoken';

import Keygenerator from 'keygenerator';
import Password from '../helpers/Password';
import UserService from './UserService';
import UserConfirmationService from './UserConfirmationService';
import Logger from '../helpers/Logger';
import EmailHelper from '../helpers/EmailHelper';

export default class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_KEY;
    this.expirationTime = process.env.JWT_EXPIRATION_TIME;
    this.userService = new UserService();
    this.userConfirmationService = new UserConfirmationService();
    this.emailHelper = new EmailHelper();
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

  async requestRecoverPassword(userConfirmation) {
    try {
      const userStored = await this.userService.searchUser(userConfirmation);

      if (userStored) {
        const userConfirmationStored = await this.userConfirmationService
          .searchUserConfirmation(userConfirmation);

        const code = Keygenerator.number({
          length: 6,
        });

        if (!userConfirmationStored) {
          const userConfirmationToBeCreated = { ...userConfirmation, code };
          await this.userConfirmationService.create(userConfirmationToBeCreated);
        } else {
          await this.userConfirmationService.edit(userConfirmationStored.id, code);
        }

        const mail = {
          email: userStored.email,
          subject: 'Teste',
          body: `Hey ${userStored.name}\nYour password recovery code is:\n${code}`,
          html: true,
        };

        this.emailHelper.sendEmail(mail);
      }
      return { message: 'If the user exists an email will be sended' };
    } catch (error) {
      Logger.printError(error);
      return { message: 'Service unavailable' };
    }
  }
}
