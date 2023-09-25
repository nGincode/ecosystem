"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class companyUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  companyUser.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "company_user",
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return companyUser;
};
