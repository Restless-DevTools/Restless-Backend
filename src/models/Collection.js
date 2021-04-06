import { Model } from 'sequelize';

export default class Collection extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        permissionType: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
      },
      { tableName: 'collection', sequelize, underscored: true },
    );
  }
}
