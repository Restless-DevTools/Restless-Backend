import UserRepository from '../repositories/UserRepository';

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async create(user) {
    try {
      const userStored = await this.userRepository.getUserByUsername(user.username);
      if (!userStored) {
        return this.userRepository.create(user);
      }
      return { message: 'Username already taken!', status: false };
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, user) {
    return this.userRepository.edit(paramsId, user);
  }

  getUser(id) {
    return this.userRepository.getUser(id);
  }

  async delete(id) {
    const deletedCode = await this.userRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'User deleted successfully', status: true };
    }
    return { message: 'It wasn not possible to deleted', status: false };
  }
}
