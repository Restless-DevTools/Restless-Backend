import { Model } from 'sequelize';

export default class Team extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
      },
      { tableName: 'team', sequelize, underscored: true },
    );
  }
}
