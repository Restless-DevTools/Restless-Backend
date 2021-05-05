import axios from 'axios';
import RequestBodyRepository from '../repositories/RequestBodyRepository';
import RequestHeaderRepository from '../repositories/RequestHeaderRepository';
import RequestQueryRepository from '../repositories/RequestQueryRepository';
import RequestRepository from '../repositories/RequestRepository';
import Logger from '../helpers/Logger';
import ResponseService from './ResponseService';

export default class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
    this.requestBodyRepository = new RequestBodyRepository();
    this.requestHeaderRepository = new RequestHeaderRepository();
    this.requestQueryRepository = new RequestQueryRepository();
    this.responseService = new ResponseService();
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

  async edit(paramsId, request) {
    await this.requestRepository.edit(paramsId, request);
    return this.getRequest(paramsId);
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
      dataValues.requestHeaders = requestHeader.map((headerQuery) => headerQuery.dataValues);
      dataValues.requestQueries = requestQuery;

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

  // eslint-disable-next-line class-methods-use-this
  extractInfoFromAxios(request, axiosRequest, error) {
    const response = {
      requestId: request.id,
      size: 0,
    };

    if (error) {
      if (axiosRequest.response) {
        if (axiosRequest.response.data) {
          response.size = Buffer.byteLength(JSON.stringify(axiosRequest.response.data), 'utf8');
        }
        response.status = axiosRequest.response.status;
        response.statusText = axiosRequest.response.statusText;
        response.data = axiosRequest.response.data;
        response.contentType = axiosRequest.response.headers['content-type'];
      } else {
        console.log(axiosRequest);
      }

      return response;
    }

    if (axiosRequest.data) {
      response.size = Buffer.byteLength(JSON.stringify(axiosRequest.data), 'utf8');
    }

    response.status = axiosRequest.status;
    response.statusText = axiosRequest.statusText;
    response.data = axiosRequest.data;
    response.contentType = axiosRequest.headers['content-type'];

    return response;
  }

  async executeRequest(request) {
    const axiosObject = {
      method: request.method,
      url: request.link,
    };

    if (request.requestBody && request.requestBody.dataValues) {
      try {
        const parsedJson = JSON.parse(request.requestBody.dataValues.body);
        axiosObject.data = parsedJson;
      } catch (error) {
        return { message: 'Invalid JSON', status: false };
      }
    }

    if (request.requestHeaders) {
      const headers = {};

      request.requestHeaders.forEach((header) => {
        headers[header.name] = header.value;
      });

      axiosObject.headers = headers;
    }

    if (request.requestQueries) {
      axiosObject.params = request.requestQueries.map((query) => (
        { [query.name]: query.value }));
    }

    try {
      const requestExecuted = await axios(axiosObject);
      return this.responseService.create(this.extractInfoFromAxios(
        request, requestExecuted, false,
      ));
    } catch (erroredRequest) {
      return this.responseService.create(this.extractInfoFromAxios(
        request, erroredRequest, true,
      ));
    }
  }

  async sendRequest(requestId, request) {
    try {
      const storedRequest = await this.getRequest(requestId);
      if (storedRequest) {
        if (request.requestBody) {
          await this.requestBodyRepository.deleteByRequestId(requestId);
          await this.requestBodyRepository.create({ ...request.requestBody, requestId });
        }

        if (request.requestHeaders) {
          await this.requestHeaderRepository.deleteByRequestId(requestId);
          await Promise.all(request.requestHeaders
            .map((header) => this.requestHeaderRepository.create(header)));
        }

        const editedRequest = await this.edit(requestId, request);
        return this.executeRequest(editedRequest);
      }

      return { message: 'Request not found!', status: false };
    } catch (error) {
      Logger.printError(error);
      return { message: 'Something went wrong', status: false };
    }
  }
}
