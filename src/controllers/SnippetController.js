import SnippetService from '../services/SnippetService';

export default new class SnippetController {
  constructor() {
    this.snippetService = new SnippetService();
  }

  getAllSnippets(req, res) {
    return this.snippetService.getAllSnippets()
      .then((snippets) => res.send(snippets));
  }

  async create(req, res) {
    const model = await this.snippetService.create(req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.snippetService.edit(req.params.id, req.body);
    return res.send(model);
  }

  getSnippet(req, res) {
    return this.snippetService.getSnippet(req.params.id)
      .then((snippet) => res.send(snippet));
  }

  async delete(req, res) {
    const status = await this.snippetService.delete(req.params.id);
    return res.send(status);
  }
}();
