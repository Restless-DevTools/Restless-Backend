import models from '../models';

export default class CollectionRepository {
  constructor() {
    this.db = models.Collection;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllCollections(user) {
    return this.db.findAll({
      where: {
        userId: user.id,
      },
    });
  }

  async create(collection) {
    const createdCollection = await this.db.create({
      name: collection.name,
      permissionType: collection.permissionType,
      description: collection.description,
      userId: collection.userId,
    });
    return createdCollection;
  }

  async edit(userId, paramsId, collection) {
    await this.db.update({
      name: collection.name,
      permissionType: collection.permissionType,
      description: collection.description,
      userId: collection.userId,
    }, {
      where: {
        id: paramsId,
        userId,
      },
    });
    return this.getCollection(userId, paramsId);
  }

  getCollection(userId, paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
        userId,
      },
    });
  }

  delete(userId, paramsId) {
    return this.db.destroy({
      where: {
        id: paramsId,
        userId,
      },
    });
  }
}
