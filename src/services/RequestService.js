import RequestBodyRepository from '../repositories/RequestBodyRepository';
import RequestHeaderRepository from '../repositories/RequestHeaderRepository';
import RequestQueryRepository from '../repositories/RequestQueryRepository';
import RequestRepository from '../repositories/RequestRepository';

export default class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
    this.requestBodyRepository = new RequestBodyRepository();
    this.requestHeaderRepository = new RequestHeaderRepository();
    this.requestQueryRepository = new RequestQueryRepository();
  }

  getAllRequests() {
    return this.requestRepository.getAllRequests();
  }

  async create(request) {
    try {
      const requestCreated = await this.requestRepository.create(request);
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
      console.log(err);
      return err;
    }
  }

  edit(paramsId, request) {
    return this.requestRepository.edit(paramsId, request);
  }

  getRequest(id) {
    return this.requestRepository.getRequest(id);
  }

  async delete(id) {
    const deletedCode = await this.requestRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Request deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }

  async getRequestsByGroupId(groupId) {
    return this.requestRepository.getRequestsByGroupId(groupId);
  }
}
