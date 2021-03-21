import TeamRepository from '../repositories/TeamRepository';

export default class TeamService {
  constructor() {
    this.teamRepository = new TeamRepository();
  }

  getAllTeams() {
    return this.teamRepository.getAllTeams();
  }

  async create(team) {
    try {
      return this.teamRepository.create(team);
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, team) {
    return this.teamRepository.edit(paramsId, team);
  }

  getTeam(id) {
    return this.teamRepository.getTeam(id);
  }

  async delete(id) {
    const deletedCode = await this.teamRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Team deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
