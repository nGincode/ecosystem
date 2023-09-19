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
      this.hasMany(models.efakturItem, {
        as: "efakturItem",
        foreignKey: "efaktur_id",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  efaktur.init(
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
        references: {
          model: "user",
          key: "id",
        },
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
