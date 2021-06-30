import CollectionRepository from '../repositories/CollectionRepository';
import UserService from './UserService';

export default class CollectionService {
  constructor() {
    this.collectionRepository = new CollectionRepository();
    this.userService = new UserService();
  }

  async getAllCollections({ user }) {
    try {
      const collectionsQuery = await this.collectionRepository.getAllCollections(user.id);
      const collections = collectionsQuery.map((collection) => (
        { ...collection, shared: +collection.userId !== +user.id }
      ));

      return collections;
    } catch (error) {
      return { message: error.message, status: false };
    }
  }

  getPublicCollections(filtersParams) {
    try {
      const filters = { ...filtersParams };

      if (!filters.offset) {
        filters.offset = 0;
      }

      filters.limit = !filters.amount ? 10 : filters.amount;

      return this.collectionRepository.getPublicCollections(filters);
    } catch (error) {
      return { message: error.message, status: false };
    }
  }

  create({ user }, collection) {
    try {
      return this.collectionRepository.create({ ...collection, userId: user.id });
    } catch (error) {
      return { message: error.message, status: false };
    }
  }

  async edit({ user }, paramsId, collection) {
    try {
      const collectionStored = await this.getCollection({ user }, paramsId);

      if (!collectionStored) {
        return { message: 'Collection not found', status: false };
      }

      if (user.id === collectionStored.userId) {
        return this.collectionRepository.edit(user.id, paramsId, collection);
      }

      if (collectionStored.sharedPermissions === 'EDIT') {
        return this.collectionRepository.edit(user.id, paramsId, collection);
      }

      return { message: 'User is not allowed to edit this collection.', status: false };
    } catch (error) {
      return { message: error.message, status: false };
    }
  }

  getCollection({ user }, collectionId) {
    try {
      return this.collectionRepository.getCollection(user.id, collectionId);
    } catch (error) {
      return { message: error.message, status: false };
    }
  }

  async delete({ user }, collectionId) {
    try {
      const deletedCode = await this.collectionRepository.delete(user.id, collectionId);
      if (deletedCode === 1) {
        return { message: 'Collection deleted successfully', status: true };
      }
      return { message: 'It was not possible to deleted', status: false };
    } catch (error) {
      return { message: error.message, status: false };
    }
  }
}
