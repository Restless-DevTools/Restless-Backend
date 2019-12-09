import models from '../models';

export default class GroupRepository {
  constructor() {
    this.db = models.Group;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllGroups() {
    return this.db.findAll();
  }

  async create(group) {
    const createdGroup = await this.db.create({
      name: group.name,
    });
    return createdGroup;
  }

  async edit(paramsId, group) {
    await this.db.update({
      name: group.name,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getGroup(paramsId);
  }

  getGroup(paramsId) {
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
}
