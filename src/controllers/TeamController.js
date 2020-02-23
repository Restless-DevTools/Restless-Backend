import TeamService from '../services/TeamService';

export default new class TeamController {
  constructor() {
    this.teamService = new TeamService();
  }

  getAllTeams(req, res) {
    return this.teamService.getAllTeams()
      .then((teams) => res.send(teams));
  }

  async create(req, res) {
    const model = await this.teamService.create(req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.teamService.edit(req.params.id, req.body);
    return res.send(model);
  }

  getTeam(req, res) {
    return this.teamService.getTeam(req.params.id)
      .then((team) => res.send(team));
  }

  async delete(req, res) {
    const status = await this.teamService.delete(req.params.id);
    return res.send(status);
  }
}();
