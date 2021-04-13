import models from '../models';

export default class SnippetRepository {
  constructor() {
    this.db = models.Snippet;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllSnippets() {
    return this.db.findAll();
  }

  async create(snippet) {
    const createdsnippet = await this.db.create({
      name: snippet.name,
      description: snippet.description,
      code: snippet.code,
      userId: snippet.userId,
      teamId: snippet.teamId,
      groupId: snippet.groupId,
      language: snippet.language,
      shareOption: snippet.shareOption,
    });
    return createdsnippet;
  }

  async edit(paramsId, snippet) {
    await this.db.update({
      name: snippet.name,
      description: snippet.description,
      code: snippet.code,
      userId: snippet.userId,
      teamId: snippet.teamId,
      groupId: snippet.groupId,
      language: snippet.language,
      shareOption: snippet.shareOption,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getSnippet(paramsId);
  }

  getSnippet(paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
      },
    });
  }

  delete(paramsId) {
    return this.db.destroy({
      where: {
        id: paramsId,
      },
    });
  }
}
