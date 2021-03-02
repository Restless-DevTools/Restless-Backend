import { Model } from 'sequelize';

export default class CollectionSharedIntegrant extends Model {
  static init(sequelize) {
    return super.init(
      {
      },
      { tableName: 'collection_shared_integrant', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.collectionAssociation = models.CollectionSharedIntegrant.belongsTo(models.Collection,
      { foreignKey: 'collectionId' });
    this.teamAssociation = models.CollectionSharedIntegrant.belongsTo(models.Team,
      { foreignKey: 'teamId' });
    this.userAssociation = models.CollectionSharedIntegrant.belongsTo(models.User,
      { foreignKey: 'userId' });
  }
}
