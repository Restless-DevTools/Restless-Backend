import ResponseRepository from '../repositories/ResponseRepository';

export default class ResponseService {
  constructor() {
    this.responseRepository = new ResponseRepository();
  }

  async create(response) {
    try {
      return this.responseRepository.create(response);
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, response) {
    return this.responseRepository.edit(paramsId, response);
  }

  getResponse(id) {
    return this.responseRepository.getResponse(id);
  }

  getResponseByRequestId(requestId) {
    return this.responseRepository.getResponseByRequestId(requestId);
  }

  async delete(id) {
    const deletedCode = await this.responseRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Response deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
