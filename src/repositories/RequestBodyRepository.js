import models from '../models';

export default class RequestBodyRepository {
  constructor() {
    this.db = models.RequestBody;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async create(requestBody) {
    const createdRequest = await this.db.create({
      body: requestBody.body,
      requestId: requestBody.requestId,
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
