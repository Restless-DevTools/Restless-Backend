import UserService from '../services/UserService';

export default new class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res) {
    const allUsers = await this.userService.getAllUsers();
    return res.send(allUsers);
  }

  async create(req, res) {
    const model = await this.userService.create(req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.userService.edit(req.params.id, req.body);
    return res.send(model);
  }

  async getUser(req, res) {
    const user = await this.userService.getUser(req.params.id);
    return res.send(user);
  }

  async delete(req, res) {
    const status = await this.userService.delete(req.params.id);
    return res.send(status);
  }

  async checkToken(req, res) {
    const status = await this.userService.delete(req.params.id);
    return res.send(status);
  }
}();
