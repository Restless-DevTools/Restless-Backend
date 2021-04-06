import models from '../models';

export default class SnippetRepository {
  constructor() {
    this.db = models.Snippet;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllSnippets() {
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

  getSnippet(paramsId) {
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
