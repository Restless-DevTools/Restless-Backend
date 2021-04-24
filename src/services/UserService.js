import UserRepository from '../repositories/UserRepository';
import Password from '../helpers/Password';

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async create(user) {
    try {
      const userStored = await this.userRepository.checkDuplicity(user);

      if (!userStored) {
        return this.userRepository.create(user);
      }
      return { message: 'Username or email already taken!', status: false };
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

  searchUser(user) {
    return this.userRepository.searchUser(user);
  }

  async delete(id) {
    const deletedCode = await this.userRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'User deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }

  async changeCurrentPassword(user) {
    const currentUser = await this.searchUser(user);
    if (currentUser) {
      const passwordCompare = await Password.comparePassword(
        user.oldPassword,
        currentUser.password,
      );
      if (passwordCompare) {
        this.edit({
          password: user.newPassword,
        });
        return { message: 'Password was changed!', status: true };
      }
    }
    return { message: 'Something went wrong!', status: false };
  }
}
