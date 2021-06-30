import models from '../models';
import Logger from '../helpers/Logger';

export default class CollectionRepository {
  constructor() {
    this.db = models.Collection;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async getAllCollections(userId) {
    try {
      const query = [];
      const replacements = {
        userId,
      };

      query.push('SELECT c.id, c.name, c.share_option "shareOption", c.created_at "createdAt",');
      query.push('c.updated_at "updatedAt", c.description, c.user_id "userId", c.shared_permissions "sharedPermissions"');
      query.push('FROM collection c');
      query.push('WHERE c.user_id = :userId OR c.team_id in (select team_id from user_team where user_id = :userId)');

      const result = await this.sequelize.query(query.join(' '),
        {
          replacements,
          type: this.sequelize.QueryTypes.SELECT,
        });
      return result;
    } catch (error) {
      Logger.printError(error);
      return [];
    }
  }

  async getPublicCollections(filters) {
    const query = [];
    const replacements = {
      shareOption: ['PUBLIC'],
    };

    query.push('SELECT c.id, c.name, c.share_option "shareOption", c.created_at "createdAt",');
    query.push('c.updated_at "updatedAt", c.description, c.user_id "userId"');
    query.push('FROM collection c');
    query.push('WHERE c.share_option in (:shareOption)');

    query.push('LIMIT :limit OFFSET :offset');
    replacements.limit = filters.limit;
    replacements.offset = filters.offset;

    try {
      const collectionsQuery = () => this.sequelize.query(query.join(' '),
        {
          replacements,
          type: this.sequelize.QueryTypes.SELECT,
        });
      const countQuery = () => this.getCount(query.join(' '), replacements);
      const [collections, count] = await Promise.all([collectionsQuery(), countQuery()]);

      return {
        count,
        offset: filters.offset,
        limit: filters.limit,
        rows: collections,
      };
    } catch (error) {
      return { error: 'ERROR_ON_SEARCH_COLLECTIONS' };
    }
  }

  async getCount(queryParam, valuesParam) {
    const values = { ...valuesParam };
    let onlyConditional = queryParam.match(/(FROM.*)/)[1];

    if (onlyConditional.includes('LIMIT')) {
      [onlyConditional] = onlyConditional.match(/(.*(?=LIMIT))/);
    }
    const query = `SELECT cast(COUNT(*) as INT) ${onlyConditional} `;
    const result = await this.sequelize.query(query,
      {
        replacements: values,
        type: this.sequelize.QueryTypes.SELECT,
      });
    return result[0].count;
  }

  async create(collection) {
    const createdCollection = await this.db.create({
      name: collection.name,
      shareOption: collection.shareOption,
      description: collection.description,
      userId: collection.userId,
      teamId: collection.teamId,
      sharedPermissions: collection.sharedPermissions,
    });
    return createdCollection;
  }

  async edit(userId, paramsId, collection) {
    await this.db.update({
      name: collection.name,
      shareOption: collection.shareOption,
      description: collection.description,
      userId: collection.userId,
      teamId: collection.teamId,
      sharedPermissions: collection.sharedPermissions,
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
