import { Model } from 'sequelize';

export default class Response extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        status: { type: DataTypes.INTEGER },
        value: { type: DataTypes.STRING },
        body: { type: DataTypes.JSONB },
      },
      { tableName: 'response', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.requestAssociation = models.Response.belongsTo(models.Request,
      { foreignKey: 'requestId' });
  }
}
