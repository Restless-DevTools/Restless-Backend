import models from '../models';

export default class TeamRepository {
  constructor() {
    this.db = models.Team;
    this.sequelize = models.sequelize;
    this.Op = models.Sequelize.Op;
  }

  getAllTeams() {
    return this.db.findAll();
  }

  async create(team) {
    const createdTeam = await this.db.create({
      name: team.name,
    });
    return createdTeam;
  }

  async edit(paramsId, team) {
    await this.db.update({
      name: team.name,
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
