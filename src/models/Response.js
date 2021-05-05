import { Model } from 'sequelize';

export default class Response extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        status: { type: DataTypes.INTEGER },
        statusText: { type: DataTypes.STRING },
        data: { type: DataTypes.JSONB },
        contentType: { type: DataTypes.STRING },
        size: { type: DataTypes.DECIMAL(10, 4) },
      },
      { tableName: 'response', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.requestAssociation = models.Response.belongsTo(models.Request,
      { foreignKey: 'requestId' });
  }
}
