import TeamRepository from '../repositories/TeamRepository';
import UserTeamRepository from '../repositories/UserTeamRepository';
import UserService from './UserService';

export default class TeamService {
  constructor() {
    this.teamRepository = new TeamRepository();
    this.userTeamRepository = new UserTeamRepository();
    this.userService = new UserService();
  }

  async getAllTeams({ user }) {
    const teams = await this.teamRepository.getAllTeams({ userId: user.id });

    const teamsWithIntegrants = await Promise.all(teams.map(async (team) => {
      const teamComplete = { ...team };
      teamComplete.integrants = await this.getTeamIntegrants(team.id);
      return teamComplete;
    }));

    return teamsWithIntegrants;
  }

  async create({ user }, team) {
    try {
      const teamCreated = await this.teamRepository.create(team);
      if (team.integrants && team.integrants.length) {
        await Promise.all(team.integrants.map((integrant) => {
          const role = (user.id === integrant.userId) ? 'admin' : undefined;

          return this.userTeamRepository.create({
            teamId: teamCreated.id,
            userId: integrant.userId,
            role,
          });
        }));
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
