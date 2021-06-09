import { Model } from 'sequelize';

export default class Snippet extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        code: { type: DataTypes.TEXT },
        language: { type: DataTypes.STRING },
        shareOption: { type: DataTypes.STRING },
      },
      { tableName: 'snippet', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.userAssociation = models.Snippet.belongsTo(models.User,
      { foreignKey: 'userId' });
    this.teamAssociation = models.Snippet.belongsTo(models.Team,
      { foreignKey: 'teamId' });
    this.groupAssociation = models.Snippet.belongsTo(models.Group,
      { foreignKey: 'groupId' });
  }
}
