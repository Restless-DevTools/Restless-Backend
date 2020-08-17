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
    const createdUser = await this.db.create({
      name: user.name,
      username: user.username,
      email: user.email,
      password: await Password.encryptPassword(user.password),
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

  getUserByUsername(username) {
    return this.db.findOne({
      where: {
        username,
      },
    });
  }
}
