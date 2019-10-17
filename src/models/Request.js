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
}
