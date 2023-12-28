"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  stock.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      no_faktur: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costumer_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      product_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      packaging: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      varian: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      invoice_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gross_amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dpp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      net_amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qty_last: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "stock",
      tableName: "stock",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return stock;
};
