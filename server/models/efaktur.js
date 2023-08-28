"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class efaktur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  efaktur.init(
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
      date: {
        type: DataTypes.STRING,
      },
      noFaktur: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.JSON,
      },
      company: {
        type: DataTypes.STRING,
      },
      jumlahDPP: {
        type: DataTypes.STRING,
      },
      jumlahPPN: {
        type: DataTypes.STRING,
      },
      jumlahPPNBM: {
        type: DataTypes.STRING,
      },
      keterangan: {
        type: DataTypes.STRING,
      },
      FGUangMuka: {
        type: DataTypes.STRING,
      },
      uangMukaDPP: {
        type: DataTypes.STRING,
      },
      uangMukaPPN: {
        type: DataTypes.STRING,
      },
      uangMukaPPNBM: {
        type: DataTypes.STRING,
      },
      referensi: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "efaktur",
      tableName: "efaktur",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return efaktur;
};
