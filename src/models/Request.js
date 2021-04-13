import { Model } from 'sequelize';

export default class Request extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        link: { type: DataTypes.STRING },
        method: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        format: { type: DataTypes.STRING },
      },
      { tableName: 'request', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.userAssociation = models.Request.belongsTo(models.User,
      { foreignKey: 'userId' });
    this.teamAssociation = models.Request.belongsTo(models.Team,
      { foreignKey: 'teamId' });
    this.groupAssociation = models.Request.belongsTo(models.Group,
      { foreignKey: 'groupId' });
  }
}
