"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class efakturItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.efaktur, {
        as: "efaktur",
        foreignKey: "efaktur_id",
      });
    }
  }
  efakturItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: DataTypes.UUID,
      efaktur_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "efaktur",
          key: "id",
        },
      },
      kodeBarang: {
        type: DataTypes.STRING,
      },
      nama: {
        type: DataTypes.STRING,
      },
      hargaSatuan: {
        type: DataTypes.STRING,
      },
      jumlahBarang: {
        type: DataTypes.STRING,
      },
      hargaTotal: {
        type: DataTypes.STRING,
      },
      diskon: {
        type: DataTypes.STRING,
      },
      DPP: {
        type: DataTypes.STRING,
      },
      PPN: {
        type: DataTypes.STRING,
      },
      tarifPPNBM: {
        type: DataTypes.STRING,
      },
      PPNBM: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      // modelName: "efaktur_Item",
      tableName: "efaktur_Item",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return efakturItem;
};
