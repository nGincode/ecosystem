"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("efaktur", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      noIdentitas: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jenis_faktur: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transaction: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      noFaktur: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nameIdentitas: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jumlahDPP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jumlahPPN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jumlahPPNBM: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      IDKeteranganTambahan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      FGUangMuka: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uangMukaDPP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uangMukaPPN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uangMukaPPNBM: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      referensi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      proof: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("efaktur");
  },
};
