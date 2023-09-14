"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("patientprovider", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      providerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "providers",
          key: "id",
        },
      },
      patientId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "patients",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("patientprovider");
  },
};
