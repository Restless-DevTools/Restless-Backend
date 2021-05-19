import models from '../models';

export default class TeamRepository {
  constructor() {
    this.db = models.Team;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  async getAllTeams(user) {
    const query = [];
    const replacements = {
      userId: user.userId,
    };

    query.push('SELECT t.id, t.name, t.description, t.created_at, t.updated_at');
    query.push('FROM team t');
    query.push('JOIN user_team ut on (ut.team_id = t.id)');
    query.push('WHERE ut.user_id = :userId');

    const result = await this.sequelize.query(query.join(' '),
      {
        replacements,
        type: this.sequelize.QueryTypes.SELECT,
      });
    return result;
  }

  async create(team) {
    const createdTeam = await this.db.create({
      name: team.name,
      description: team.description,
    });
    return createdTeam;
  }

  async edit(paramsId, team) {
    await this.db.update({
      name: team.name,
      description: team.description,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getTeam(paramsId);
  }

  getTeam(paramsId) {
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
