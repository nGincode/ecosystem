"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class efakturIn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  efakturIn.init(
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
      KD_JENIS_TRANSAKSI: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FG_PENGGANTI: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NOMOR_FAKTUR: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      MASA_PAJAK: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TAHUN_PAJAK: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TANGGAL_FAKTUR: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NPWP: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NAMA: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ALAMAT_LENGKAP: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      JUMLAH_DPP: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      JUMLAH_PPN: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      JUMLAH_PPNBM: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IS_CREDITABLE: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "efakturIn",
      tableName: "efaktur_in",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return efakturIn;
};
