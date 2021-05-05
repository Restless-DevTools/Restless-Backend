import axios from 'axios';
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
      Logger.printError(err);
      return err;
    }
  }

  edit(paramsId, request) {
    return this.requestRepository.edit(paramsId, request);
  }

  async getRequest(id) {
    try {
      const { dataValues } = await this.requestRepository.getRequest(id);

      const [requestBody, requestHeader, requestQuery] = await Promise.all([
        this.requestBodyRepository.getByRequestId(id),
        this.requestHeaderRepository.getByRequestId(id),
        this.requestQueryRepository.getByRequestId(id),
      ]);

      dataValues.requestBody = requestBody;
      dataValues.requestHeader = requestHeader;
      dataValues.requestQuery = requestQuery;

      return dataValues;
    } catch (error) {
      return null;
    }
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

  async executeRequest(request) {
    const axiosObject = {
      method: request.method,
      url: request.link,
    };

    if (request.requestBody) {
      axiosObject.data = request.requestBody;
    }

    if (request.requestHeader) {
      axiosObject.headers = request.requestHeader;
    }

    if (request.requestQuery) {
      axiosObject.params = request.requestQuery;
    }

    const requestExecuted = await axios(axiosObject);

    return this.responseService.create({
      requestId: request.id,
      status: requestExecuted.status,
      body: requestExecuted,
    });
  }

  async sendRequest(requestId, request) {
    const storedRequest = await this.getRequest(requestId);
    if (storedRequest) {
      const editedRequest = await this.edit(requestId, request);

      if (request.requestBody) {
        if (request.requestBody.id) {
          await this.requestBodyRepository.edit(request.requestBody.id, request.requestBody);
        } else {
          await this.requestBodyRepository.create(request.requestBody);
        }
      }

      return editedRequest;
    }

    return { message: 'Request not found!', status: false };
  }
}
