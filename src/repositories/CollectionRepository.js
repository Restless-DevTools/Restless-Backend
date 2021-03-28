import models from '../models';

export default class CollectionRepository {
  constructor() {
    this.db = models.Collection;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllCollections() {
    return this.db.findAll();
  }

  async create(collection) {
    const createdCollection = await this.db.create({
      name: collection.name,
      permissionType: collection.permissionType,
    });
    return createdCollection;
  }

  async edit(paramsId, collection) {
    await this.db.update({
      name: collection.name,
      permissionType: collection.permissionType,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getCollection(paramsId);
  }

  getCollection(paramsId) {
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
