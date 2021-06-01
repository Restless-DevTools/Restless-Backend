import models from '../models';

export default class SnippetRepository {
  constructor() {
    this.db = models.Snippet;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllSnippets(user) {
    return this.db.findAll({
      where: {
        userId: user.id,
      },
    });
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

  async edit(userId, paramsId, snippet) {
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
        userId,
      },
    });
    return this.getSnippet(userId, paramsId);
  }

  getSnippet(userId, paramsId) {
    return this.db.findOne({
      where: {
        id: paramsId,
        userId,
      },
    });
  }

  delete(userId, paramsId) {
    return this.db.destroy({
      where: {
        id: paramsId,
        userId,
      },
    });
  }
}
