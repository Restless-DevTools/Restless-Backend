import models from '../models';

export default class RequestRepository {
  constructor() {
    this.db = models.Request;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllRequests() {
    return this.db.findAll();
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

  async edit(paramsId, request) {
    return this.db.update({
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
      },
    });
  }

  getRequest(paramsId) {
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

  getRequestsByGroupId(groupId) {
    return this.db.findAll({ where: { groupId } });
  }
}
