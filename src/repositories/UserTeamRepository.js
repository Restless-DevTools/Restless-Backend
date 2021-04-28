import models from '../models';

export default class UserTeamRepository {
  constructor() {
    this.db = models.UserTeam;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllTeams() {
    return this.db.findAll();
  }

  async create(team) {
    const createdTeam = await this.db.create({
      userId: team.userId,
      teamId: team.teamId,
      role: team.role,
    });
    return createdTeam;
  }

  async edit(paramsId, team) {
    await this.db.update({
      userId: team.userId,
      teamId: team.teamId,
      role: team.role,
    }, {
      where: {
        id: paramsId,
      },
    });
    return this.getTeam(paramsId);
  }

  getByTeam(teamId) {
    return this.db.findAll({
      where: {
        teamId,
      },
    });
  }

  getByUserId(userId) {
    return this.db.findAll({
      where: {
        userId,
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
