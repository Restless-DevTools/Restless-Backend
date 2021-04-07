import SnippetRepository from '../repositories/SnippetRepository';

export default class SnippetService {
  constructor() {
    this.snippetRepository = new SnippetRepository();
  }

  getAllSnippets() {
    return this.snippetRepository.getAllSnippets();
  }

  async create(snippet) {
    try {
      return this.snippetRepository.create(snippet);
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, snippet) {
    return this.snippetRepository.edit(paramsId, snippet);
  }

  getSnippet(id) {
    return this.snippetRepository.getSnippet(id);
  }

  async delete(id) {
    const deletedCode = await this.snippetRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Snippet deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
