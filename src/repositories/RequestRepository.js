import models from '../models';

export default class RequestRepository {
  constructor() {
    this.db = models.Request;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllRequests(user) {
    return this.db.findAll({
      where: {
        userId: user.id,
      },
    });
  }

  async create(request) {
    const createdRequest = await this.db.create({
      link: request.link,
      method: request.method,
      name: request.name,
      format: request.format,
      groupId: request.groupId,
      userId: request.userId,
      teamId: request.teamId,
    });
    return createdRequest;
  }

  async edit(userId, paramsId, request) {
    await this.db.update({
      link: request.link,
      method: request.method,
      name: request.name,
      format: request.format,
      groupId: request.groupId,
      userId: request.userId,
      teamId: request.teamId,
    }, {
      where: {
        id: paramsId,
        userId,
      },
    });
    return this.getRequest(userId, paramsId);
  }

  getRequest(userId, paramsId) {
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

  getRequestsByGroupId(groupId) {
    return this.db.findAll({ where: { groupId } });
  }
}
