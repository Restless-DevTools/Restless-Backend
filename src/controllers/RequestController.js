import RequestService from '../services/RequestService';

export default new class RequestController {
  constructor() {
    this.requestService = new RequestService();
  }

  async getAllRequests(req, res) {
    const requests = await this.requestService.getAllRequests(req.user);
    return res.send(requests);
  }

  async create(req, res) {
    const model = await this.requestService.create(req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.requestService.edit(req.params.id, req.body);
    return res.send(model);
  }

  getRequest(req, res) {
    return this.requestService.getRequest(req.params.id)
      .then((snippet) => res.send(snippet));
  }

  async delete(req, res) {
    const status = await this.requestService.delete(req.params.id);
    return res.send(status);
  }

  async sendRequest(req, res) {
    const request = await this.requestService.sendRequest(req.params.id, req.body);
    return res.send(request);
  }
}();
