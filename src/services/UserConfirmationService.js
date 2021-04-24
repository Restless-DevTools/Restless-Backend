import UserConfirmationRepository from '../repositories/UserConfirmationRepository';

export default class UserConfirmationService {
  constructor() {
    this.userConfirmationRepository = new UserConfirmationRepository();
  }

  create(userConfirmation) {
    return this.userConfirmationRepository.create(userConfirmation);
  }

  edit(paramsId, userConfirmation) {
    return this.userConfirmationRepository.edit(paramsId, userConfirmation);
  }

  getUserConfirmation(id) {
    return this.userConfirmationRepository.getUserConfirmation(id);
  }

  searchUserConfirmation(userConfirmation) {
    return this.userConfirmationRepository.searchUserConfirmation(userConfirmation);
  }
}
