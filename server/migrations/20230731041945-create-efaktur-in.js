"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("efaktur_in", {
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
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      KD_JENIS_TRANSAKSI: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      FG_PENGGANTI: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      NOMOR_FAKTUR: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      MASA_PAJAK: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TAHUN_PAJAK: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TANGGAL_FAKTUR: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      NPWP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      NAMA: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ALAMAT_LENGKAP: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      JUMLAH_DPP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      JUMLAH_PPN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      JUMLAH_PPNBM: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      IS_CREDITABLE: {
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
    await queryInterface.dropTable("efaktur_in");
  },
};
