import { Model } from 'sequelize';

export default class RequestQuery extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        value: { type: DataTypes.STRING },
      },
      { tableName: 'request_query', sequelize, underscored: true },
    );
  }

  static associate(models) {
    this.requestAssociation = models.RequestQuery.belongsTo(models.Request,
      { foreignKey: 'requestId' });
  }
}
