import { Model } from 'sequelize';

export default class RequestBody extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        body: { type: DataTypes.JSONB },
      },
      { tableName: 'request_body', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.requestAssociation = models.RequestBody.belongsTo(models.Request,
      { foreignKey: 'requestId' });
  }
}
