import RequestBodyRepository from '../repositories/RequestBodyRepository';
import RequestHeaderRepository from '../repositories/RequestHeaderRepository';
import RequestQueryRepository from '../repositories/RequestQueryRepository';
import RequestRepository from '../repositories/RequestRepository';
import Logger from '../helpers/Logger';

export default class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
    this.requestBodyRepository = new RequestBodyRepository();
    this.requestHeaderRepository = new RequestHeaderRepository();
    this.requestQueryRepository = new RequestQueryRepository();
  }

  getAllRequests({ user }) {
    return this.requestRepository.getAllRequests({ id: user.id });
  }

  async create({ user }, request) {
    try {
      const requestCreated = await this.requestRepository.create({ ...request, userId: user.id });
      const relationedOperations = [];

      if (request.requestBody) {
        relationedOperations.push(
          this.requestBodyRepository.create(
            { ...request.requestBody, requestId: requestCreated.id },
          ),
        );
      }

      if (request.requestHeader) {
        relationedOperations.push(
          this.requestHeaderRepository.create(
            { ...request.requestHeader, requestId: requestCreated.id },
          ),
        );
      }

      if (request.requestQuery) {
        relationedOperations.push(
          this.requestQueryRepository.create(
            { ...request.requestQuery, requestId: requestCreated.id },
          ),
        );
      }

      await Promise.all(relationedOperations);

      return requestCreated;
    } catch (err) {
      Logger.printError(err);
      return err;
    }
  }

  edit({ user }, paramsId, request) {
    return this.requestRepository.edit(user.id, paramsId, request);
  }

  getRequest({ user }, id) {
    return this.requestRepository.getRequest(user.id, id);
  }

  async delete({ user }, id) {
    const deletedCode = await this.requestRepository.delete(user.id, id);
    if (deletedCode === 1) {
      return { message: 'Request deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }

  async getRequestsByGroupId(groupId) {
    return this.requestRepository.getRequestsByGroupId(groupId);
  }
}
