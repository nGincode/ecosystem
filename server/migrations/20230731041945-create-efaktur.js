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
      uuid: Sequelize.UUID,
      noIdentitas: {
        type: Sequelize.STRING,
      },
      jenis_faktur: {
        type: Sequelize.STRING,
      },
      transaction: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      noFaktur: {
        type: Sequelize.STRING,
      },
      nameIdentitas: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      nameIdentitas: {
        type: Sequelize.STRING,
      },
      jumlahDPP: {
        type: Sequelize.STRING,
      },
      jumlahPPN: {
        type: Sequelize.STRING,
      },
      jumlahPPNBM: {
        type: Sequelize.STRING,
      },
      IDKeteranganTambahan: {
        type: Sequelize.STRING,
      },
      FGUangMuka: {
        type: Sequelize.STRING,
      },
      uangMukaDPP: {
        type: Sequelize.STRING,
      },
      uangMukaPPN: {
        type: Sequelize.STRING,
      },
      uangMukaPPNBM: {
        type: Sequelize.STRING,
      },
      referensi: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("efaktur");
  },
};
