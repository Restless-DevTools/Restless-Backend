import { Model } from 'sequelize';

export default class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: { type: DataTypes.STRING },
        username: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        password: { type: DataTypes.STRING },
        github: { type: DataTypes.BOOLEAN },
      },
      { tableName: 'user', sequelize, underscored: true },
    );
  }
}
