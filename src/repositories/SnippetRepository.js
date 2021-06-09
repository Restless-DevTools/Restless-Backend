import models from '../models';
import Logger from '../helpers/Logger';

export default class SnippetRepository {
  constructor() {
    this.db = models.Snippet;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async getAllSnippets(user) {
    try {
      const query = [];
      const replacements = {
        userId: user.id,
      };

      query.push('SELECT s.id, s.name, s.description, s.language, s.share_option "shareOption", s.created_at "createdAt",');
      query.push('s.user_id "userId", s.team_id "teamId"');
      query.push('FROM snippet s');
      query.push('WHERE s.user_id = :userId');
      query.push('OR s.team_id in (select team_id from user_team where user_id = :userId)');

      const result = await this.sequelize.query(query.join(' '),
        {
          replacements,
          type: this.sequelize.QueryTypes.SELECT,
        });
      return result;
    } catch (error) {
      Logger.printError(error);
      return [];
    }
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
