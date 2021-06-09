import axios from 'axios';
import { differenceInMilliseconds } from 'date-fns';
import Logger from '../helpers/Logger';
import RequestBodyRepository from '../repositories/RequestBodyRepository';
import RequestHeaderRepository from '../repositories/RequestHeaderRepository';
import RequestQueryRepository from '../repositories/RequestQueryRepository';
import RequestRepository from '../repositories/RequestRepository';
import ResponseService from './ResponseService';

export default class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
    this.requestBodyRepository = new RequestBodyRepository();
    this.requestHeaderRepository = new RequestHeaderRepository();
    this.requestQueryRepository = new RequestQueryRepository();
    this.responseService = new ResponseService();
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

  // eslint-disable-next-line class-methods-use-this
  extractInfoFromAxios(request, axiosRequest, error, times) {
    try {
      const response = {
        requestId: request.id,
        size: 0,
        allTransactionTime: differenceInMilliseconds(times.executeEndTime, times.startTime),
        requestTime: differenceInMilliseconds(times.executeEndTime, times.executeStartTime),
      };

      if (error) {
        if (axiosRequest.response) {
          if (axiosRequest.response.data) {
            response.size = Buffer.byteLength(JSON.stringify(axiosRequest.response.data), 'utf8');
          }
          response.status = axiosRequest.response.status;
          response.statusText = axiosRequest.response.statusText;
          response.data = JSON.stringify(axiosRequest.response.data);
          response.contentType = axiosRequest.response.headers['content-type'];
          response.headers = JSON.stringify(axiosRequest.response.headers);
        } else {
          return { message: 'Could not execute request', status: false };
        }

        return response;
      }

      if (axiosRequest.data) {
        response.size = Buffer.byteLength(JSON.stringify(axiosRequest.data), 'utf8');
      }

      response.status = axiosRequest.status;
      response.statusText = axiosRequest.statusText;
      response.data = JSON.stringify(axiosRequest.data);
      response.contentType = axiosRequest.headers['content-type'];
      response.headers = JSON.stringify(axiosRequest.headers);

      return response;
    } catch (err) {
      Logger.printError(err);
      return {};
    }
  }

  async executeRequest(request, startTime) {
    const times = { startTime: new Date(startTime) };
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

    times.executeStartTime = new Date();
    try {
      const requestExecuted = await axios(axiosObject);
      times.executeEndTime = new Date();
      return this.responseService.create(this.extractInfoFromAxios(
        request, requestExecuted, false, times,
      ));
    } catch (erroredRequest) {
      times.executeEndTime = new Date();
      return this.responseService.create(this.extractInfoFromAxios(
        request, erroredRequest, true, times,
      ));
    }
  }

  async sendRequest(user, requestId, request) {
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

        await this.edit(user, requestId, request);
        const completeRequest = await this.getRequest(requestId);

        return this.executeRequest(completeRequest, request.startTime);
      }

      return { message: 'Request not found!', status: false };
    } catch (error) {
      Logger.printError(error);
      return { message: 'Something went wrong', status: false };
    }
  }
}
