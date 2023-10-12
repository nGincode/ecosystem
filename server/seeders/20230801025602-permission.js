"use strict";
const Password = require("node-php-password");
const Crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.bulkInsert("permission", [
      {
        user_id: 1,
        name: "Admin",
        view: "all",
        data: JSON.stringify([
          {
            data: [
              {
                link: "/analytics",
                name: "analytics[]",
                label: "Analytics",
                checklist: ["view", "create", "edit", "delete"],
              },
            ],
            check: true,
            label: "Dashboards",
          },
          {
            data: [
              {
                link: "/users",
                name: "users[]",
                label: "Users",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                link: "/permission",
                name: "permission[]",
                label: "Permission",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                link: "/company",
                name: "company[]",
                label: "Company",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                link: "/npwp",
                name: "npwp[]",
                label: "NPWP",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                data: [
                  {
                    link: "/efaktur/in",
                    name: "efakturIn[]",
                    label: "E-Faktur In",
                    checklist: ["view", "create", "edit", "delete"],
                  },
                  {
                    link: "/efaktur/out",
                    name: "efakturOut[]",
                    label: "E-Faktur Out",
                    checklist: ["view", "create", "edit", "delete"],
                  },
                ],
                check: true,
                label: "E-Faktur",
              },
            ],
            check: true,
            label: "Accounts",
          },
        ]),
        uuid: Crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete("permission", null, {});
  },
};
