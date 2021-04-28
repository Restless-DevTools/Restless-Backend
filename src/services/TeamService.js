import TeamRepository from '../repositories/TeamRepository';
import UserTeamRepository from '../repositories/UserTeamRepository';
import UserService from './UserService';

export default class TeamService {
  constructor() {
    this.teamRepository = new TeamRepository();
    this.userTeamRepository = new UserTeamRepository();
    this.userService = new UserService();
  }

  async getAllTeams() {
    const teams = await this.teamRepository.getAllTeams();
    const teamsWithIntegrants = await Promise.all(teams.map(async (team) => {
      const teamComplete = { ...team.dataValues };
      teamComplete.integrants = await this.getTeamIntegrants(team.id);
      return teamComplete;
    }));

    return teamsWithIntegrants;
  }

  async create(team) {
    try {
      const teamCreated = await this.teamRepository.create(team);
      if (team.integrants && team.integrants.length) {
        team.integrants.forEach((integrant) => {
          this.userTeamRepository.create({ teamId: teamCreated.id, userId: integrant.userId });
        });
      }

      return teamCreated;
    } catch (err) {
      return err;
    }
  }

  async edit(paramsId, team) {
    const currentIntegrants = await this.userTeamRepository.getByTeam(paramsId);

    if (currentIntegrants && currentIntegrants.length) {
      await Promise.all(currentIntegrants.map((integrant) => this.userTeamRepository
        .delete(integrant.id)));
    }

    if (team.integrants && team.integrants.length) {
      await Promise.all(team.integrants.map((integrant) => this.userTeamRepository
        .create({ teamId: paramsId, userId: integrant.userId })));
    }

    return this.teamRepository.edit(paramsId, team);
  }

  async getTeam(id) {
    const team = await this.teamRepository.getTeam(id);
    const integrants = await this.getTeamIntegrants(id);

    const teamsWithIntegrants = team.dataValues;
    teamsWithIntegrants.integrants = integrants;

    return teamsWithIntegrants;
  }

  async getTeamIntegrants(teamId) {
    const integrantsRelationed = await this.userTeamRepository.getByTeam(teamId);

    return this.userService.getUsersPublicAttributes(integrantsRelationed
      .map((integrant) => integrant.userId));
  }

  async delete(id) {
    const deletedCode = await this.teamRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Team deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
