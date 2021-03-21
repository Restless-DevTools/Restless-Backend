import GroupRepository from '../repositories/GroupRepository';

export default class GroupService {
  constructor() {
    this.groupRepository = new GroupRepository();
  }

  getAllGroups() {
    return this.groupRepository.getAllGroups();
  }

  async create(group) {
    try {
      return this.groupRepository.create(group);
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, group) {
    return this.groupRepository.edit(paramsId, group);
  }

  getGroup(id) {
    return this.groupRepository.getGroup(id);
  }

  async delete(id) {
    const deletedCode = await this.groupRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Group deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
