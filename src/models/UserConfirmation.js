import { Model } from 'sequelize';

export default class UserConfirmation extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        username: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        code: { type: DataTypes.STRING },
        validated: { type: DataTypes.BOOLEAN },
      },
      { tableName: 'user_confirmation', sequelize, underscored: true },
    );
  }
}
