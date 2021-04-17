import models from '../models';

export default class UserConfirmationRepository {
  constructor() {
    this.db = models.UserConfirmation;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async create(userConfirmation) {
    try {
      const createdUserConfirmation = await this.db.create({
        username: userConfirmation.username,
        email: userConfirmation.email,
        code: userConfirmation.code,
        validated: false,
      });
      return createdUserConfirmation;
    } catch (error) {
      return error.message;
    }
  }

  async edit(paramsId, code) {
    await this.db.update({
      code,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getUserConfirmation(paramsId);
  }

  getUserConfirmation(paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
      },
    });
  }

  searchUserConfirmation(userConfirmation) {
    const where = {};

    if (userConfirmation.username) {
      where.username = userConfirmation.username;
    }

    if (userConfirmation.email) {
      where.email = userConfirmation.email;
    }

    return this.db.findOne({
      where,
    });
  }

  async validateUser(paramsId) {
    await this.db.update({
      validated: true,
    }, {
      where: {
        id: paramsId,
      },
    });

    return this.getUserConfirmation(paramsId);
  }
}
