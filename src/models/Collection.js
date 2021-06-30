import { Model } from 'sequelize';

export default class Collection extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        shareOption: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        sharedPermissions: { type: DataTypes.STRING },
      },
      { tableName: 'collection', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.userAssociation = models.Collection.belongsTo(models.User,
      { foreignKey: 'userId' });
    this.teamAssociation = models.Collection.belongsTo(models.Team,
      { foreignKey: 'teamId' });
  }
}
