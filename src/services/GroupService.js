import GroupRepository from '../repositories/GroupRepository';
import RequestService from './RequestService';

export default class GroupService {
  constructor() {
    this.groupRepository = new GroupRepository();
    this.requestService = new RequestService();
  }

  async getByCollectionId(collectionId) {
    const groups = await this.groupRepository.getByCollectionId(collectionId);
    const groupsWithRequests = await Promise.all(groups.map(async (group) => {
      const groupWithRequests = { ...group.dataValues };
      const requestsByGroup = await this.requestService.getRequestsByGroupId(groupWithRequests.id);

      groupWithRequests.requests = requestsByGroup;
      return groupWithRequests;
    }));

    return groupsWithRequests;
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
