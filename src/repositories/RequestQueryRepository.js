import models from '../models';

export default class RequestQueryRepository {
  constructor() {
    this.db = models.RequestQuery;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async create(requestQuery) {
    const createdRequest = await this.db.create({
      name: requestQuery.name,
      value: requestQuery.value,
      requestId: requestQuery.requestId,
    });
    return createdRequest;
  }

  getByRequestId(requestId) {
    return this.db.findOne({
      where: {
        requestId,
      },
    });
  }
}
