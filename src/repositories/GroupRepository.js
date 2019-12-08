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
    const createdgroup = await this.db.create({
      name: group.name,
    });
    return createdgroup;
  }

  async edit(paramsId, group) {
    await this.db.update({
      name: group.name,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.singlegroup(paramsId);
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
