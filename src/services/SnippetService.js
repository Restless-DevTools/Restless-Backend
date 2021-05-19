import SnippetRepository from '../repositories/SnippetRepository';

export default class SnippetService {
  constructor() {
    this.snippetRepository = new SnippetRepository();
  }

  getAllSnippets({ user }) {
    return this.snippetRepository.getAllSnippets({ id: user.id });
  }

  async create({ user }, snippet) {
    try {
      return this.snippetRepository.create({ ...snippet, userId: user.id });
    } catch (err) {
      return err;
    }
  }

  edit({ user }, paramsId, snippet) {
    return this.snippetRepository.edit(user.id, paramsId, snippet);
  }

  getSnippet({ user }, id) {
    return this.snippetRepository.getSnippet(user.id, id);
  }

  async delete({ user }, id) {
    const deletedCode = await this.snippetRepository.delete(user.id, id);
    if (deletedCode === 1) {
      return { message: 'Snippet deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
