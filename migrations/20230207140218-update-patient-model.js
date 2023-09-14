"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("patients", "status", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("patients", "diagnosis", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("patients", "sex", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("patients", "status");
    await queryInterface.removeColumn("patients", "diagnosis");
    await queryInterface.removeColumn("patients", "sex");
  },
};
