"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class npwp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  npwp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: DataTypes.UUID,
      npwp: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: "npwp",
      tableName: "npwp",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return npwp;
};
