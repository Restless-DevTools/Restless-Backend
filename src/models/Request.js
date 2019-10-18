import { Model } from 'sequelize';

export default class Request extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        link: { type: DataTypes.STRING },
        method: { type: DataTypes.STRING },
      },
      { tableName: 'request', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.userAssociation = models.UserTeam.belongsTo(models.Request,
      { foreignKey: 'userId' });
    this.teamAssociation = models.UserTeam.belongsTo(models.Request,
      { foreignKey: 'teamId' });
    this.groupAssociation = models.UserTeam.belongsTo(models.Group,
      { foreignKey: 'groupId' });
  }
}
