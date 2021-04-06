import SnippetRepository from '../repositories/SnippetRepository';

export default class SnippetService {
  constructor() {
    this.snippetRepository = new SnippetRepository();
  }

  getAllSnippets() {
    return this.snippetRepository.getAllCollections();
  }

  async create(collection) {
    try {
      return this.snippetRepository.create(collection);
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, collection) {
    return this.snippetRepository.edit(paramsId, collection);
  }

  getSnippet(id) {
    return this.snippetRepository.getCollection(id);
  }

  async delete(id) {
    const deletedCode = await this.snippetRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Snippet deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
