import { Model } from 'sequelize';

export default class RequestHeader extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        value: { type: DataTypes.STRING },
      },
      { tableName: 'request_header', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.requestAssociation = models.RequestHeader.belongsTo(models.Request,
      { foreignKey: 'requestId' });
  }
}
