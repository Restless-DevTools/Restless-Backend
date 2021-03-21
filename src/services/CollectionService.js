import CollectionRepository from '../repositories/CollectionRepository';

export default class CollectionService {
  constructor() {
    this.collectionRepository = new CollectionRepository();
  }

  getAllCollections() {
    return this.collectionRepository.getAllCollections();
  }

  async create(collection) {
    try {
      return this.collectionRepository.create(collection);
    } catch (err) {
      return err;
    }
  }

  edit(paramsId, collection) {
    return this.collectionRepository.edit(paramsId, collection);
  }

  getCollection(id) {
    return this.collectionRepository.getCollection(id);
  }

  async delete(id) {
    const deletedCode = await this.collectionRepository.delete(id);
    if (deletedCode === 1) {
      return { message: 'Collection deleted successfully', status: true };
    }
    return { message: 'It was not possible to deleted', status: false };
  }
}
