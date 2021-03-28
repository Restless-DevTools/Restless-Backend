import { Model } from 'sequelize';

export default class Group extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
      },
      { tableName: 'group', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.collectionAssociation = models.Group.belongsTo(models.Collection,
      { foreignKey: 'collectionId' });
  }
}
