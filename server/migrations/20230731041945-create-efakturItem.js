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
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      efaktur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "efaktur",
          key: "id",
        },
      },
      kodeBarang: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hargaSatuan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jumlahBarang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hargaTotal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      diskon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      DPP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PPN: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tarifPPNBM: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      PPNBM: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("efaktur_item");
  },
};
