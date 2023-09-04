"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("efaktur_item", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: Sequelize.UUID,
      efaktur_id: {
        type: Sequelize.INTEGER,
      },
      kodeBarang: {
        type: Sequelize.STRING,
      },
      nama: {
        type: Sequelize.STRING,
      },
      hargaSatuan: {
        type: Sequelize.STRING,
      },
      jumlahBarang: {
        type: Sequelize.STRING,
      },
      hargaTotal: {
        type: Sequelize.STRING,
      },
      diskon: {
        type: Sequelize.STRING,
      },
      DPP: {
        type: Sequelize.STRING,
      },
      PPN: {
        type: Sequelize.STRING,
      },
      tarifPPNBM: {
        type: Sequelize.STRING,
      },
      PPNBM: {
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
    await queryInterface.dropTable("efaktur_item");
  },
};
