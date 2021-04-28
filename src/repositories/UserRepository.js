import models from '../models';
import Password from '../helpers/Password';

export default class UserRepository {
  constructor() {
    this.db = models.User;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllUsers() {
    return this.db.findAll();
  }

  async create(user) {
    let password = null;
    if (user.password) {
      password = await Password.encryptPassword(user.password);
    }
    const createdUser = await this.db.create({
      name: user.name,
      username: user.username,
      email: user.email,
      password,
      github: user.github,
    });
    return createdUser;
  }

  async edit(paramsId, user) {
    let password = null;
    if (user.password) {
      password = await Password.encryptPassword(user.password);
    }
    await this.db.update({
      name: user.name,
      username: user.username,
      email: user.email,
      password,
      github: user.github,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getUser(paramsId);
  }

  getUser(paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
      },
    });
  }

  delete(paramsId) {
    return this.db.destroy({
      where: {
        id: paramsId,
      },
    });
  }

  searchUser(user) {
    const where = {};

    if (user.username) {
      where.username = user.username;
    }

    if (user.email) {
      where.email = user.email;
    }

    if (user.github) {
      where.github = user.github;
    }

    return this.db.findOne({
      where,
    });
  }

  checkDuplicity(user) {
    return this.db.count({
      where: {
        [this.Op.or]: {
          username: user.username,
          email: user.email,
        },
      },
    });
  }
}
