import ResponseService from '../services/ResponseService';

export default new class ResponseController {
  constructor() {
    this.responseService = new ResponseService();
  }

  async getAllResponses(req, res) {
    const { requestId } = req.query;

    const requests = await this.responseService.getResponseByRequestId(requestId);
    return res.send(requests);
  }

  getResponse(req, res) {
    return this.responseService.getResponse(req.params.id)
      .then((snippet) => res.send(snippet));
  }

  async delete(req, res) {
    const status = await this.responseService.delete(req.params.id);
    return res.send(status);
  }
}();
