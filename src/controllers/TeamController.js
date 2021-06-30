import TeamService from '../services/TeamService';

export default new class TeamController {
  constructor() {
    this.teamService = new TeamService();
  }

  async getAllTeams(req, res) {
    const teams = await this.teamService.getAllTeams(req.user);
    return res.send(teams);
  }

  async create(req, res) {
    const model = await this.teamService.create(req.user, req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.teamService.edit(req.params.id, req.body);
    return res.send(model);
  }

  async getTeam(req, res) {
    const team = await this.teamService.getTeam(req.params.id);
    return res.send(team);
  }

  async delete(req, res) {
    const status = await this.teamService.delete(req.params.id);
    return res.send(status);
  }
}();
