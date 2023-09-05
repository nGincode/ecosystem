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
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      efaktur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "efaktur",
          key: "id",
        },
      },
      kodeBarang: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hargaSatuan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlahBarang: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hargaTotal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      diskon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      DPP: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PPN: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tarifPPNBM: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PPNBM: {
        type: DataTypes.STRING,
        allowNull: false,
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
