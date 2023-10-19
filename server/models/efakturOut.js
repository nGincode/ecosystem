"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class efakturOut extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.efakturOutItem, {
        as: "efakturOutItem",
        foreignKey: "efaktur_out_id",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  efakturOut.init(
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
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      noIdentitas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_faktur: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noFaktur: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameIdentitas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlahDPP: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlahPPN: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlahPPNBM: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IDKeteranganTambahan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      FGUangMuka: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uangMukaDPP: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uangMukaPPN: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uangMukaPPNBM: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      referensi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      proof: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "efakturOut",
      tableName: "efaktur_out",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return efakturOut;
};
