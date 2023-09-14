"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "sex", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("users", "status", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("users", "diagnosis", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "sex");
    await queryInterface.removeColumn("users", "status");
    await queryInterface.removeColumn("users", "diagnosis");
  },
};
