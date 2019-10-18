import { Model } from 'sequelize';

export default class UserTeam extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        role: { type: DataTypes.STRING },
      },
      { tableName: 'user_team', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.userAssociation = models.UserTeam.belongsTo(models.User,
      { foreignKey: 'userId' });
    this.teamAssociation = models.UserTeam.belongsTo(models.Team,
      { foreignKey: 'teamId' });
  }
}
