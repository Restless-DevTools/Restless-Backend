import models from '../models';

export default class RequestHeaderRepository {
  constructor() {
    this.db = models.RequestHeader;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async create(requestHeader) {
    const createdRequest = await this.db.create({
      name: requestHeader.name,
      value: requestHeader.value,
      requestId: requestHeader.requestId,
    });
    return createdRequest;
  }

  getByRequestId(requestId) {
    return this.db.findAll({
      where: {
        requestId,
      },
    });
  }
}
