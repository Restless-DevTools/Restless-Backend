import GroupService from '../services/GroupService';

export default new class GroupController {
  constructor() {
    this.groupService = new GroupService();
  }

  getAllGroups(req, res) {
    return this.groupService.getAllGroups()
      .then((groups) => res.send(groups));
  }

  async create(req, res) {
    const model = await this.groupService.create(req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.groupService.edit(req.params.id, req.body);
    return res.send(model);
  }

  getGroup(req, res) {
    return this.groupService.getGroup(req.params.id)
      .then((group) => res.send(group));
  }

  async delete(req, res) {
    const status = await this.groupService.delete(req.params.id);
    return res.send(status);
  }
}();
