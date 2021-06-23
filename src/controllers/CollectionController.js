import CollectionService from '../services/CollectionService';

export default new class CollectionController {
  constructor() {
    this.collectionService = new CollectionService();
  }

  getAllCollections(req, res) {
    return this.collectionService.getAllCollections(req.user)
      .then((collections) => res.send(collections));
  }

  getPublicCollections(req, res) {
    const filters = {
      offset: req.query.offset,
      amount: req.query.amount,
    };

    return this.collectionService.getPublicCollections(filters)
      .then((collections) => res.send(collections));
  }

  async create(req, res) {
    const model = await this.collectionService.create(req.user, req.body);
    return res.send(model);
  }

  async edit(req, res) {
    const model = await this.collectionService.edit(req.user, req.params.id, req.body);
    return res.send(model);
  }

  getCollection(req, res) {
    return this.collectionService.getCollection(req.user, req.params.id)
      .then((group) => res.send(group));
  }

  async delete(req, res) {
    const status = await this.collectionService.delete(req.user, req.params.id);
    return res.send(status);
  }
}();
