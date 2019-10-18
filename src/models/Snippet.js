import { Model } from 'sequelize';

export default class Snippet extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        code: { type: DataTypes.TEXT },
      },
      { tableName: 'snippet', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.userAssociation = models.Snippet.belongsTo(models.Request,
      { foreignKey: 'userId' });
    this.teamAssociation = models.Snippet.belongsTo(models.Request,
      { foreignKey: 'teamId' });
    this.groupAssociation = models.Snippet.belongsTo(models.Group,
      { foreignKey: 'groupId' });
  }
}
