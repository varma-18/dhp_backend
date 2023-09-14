"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("patients", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.removeColumn("patients", "firstName");
    await queryInterface.removeColumn("patients", "lastName");
    await queryInterface.removeColumn("patients", "orgId");
    await queryInterface.removeColumn("patients", "email");
    await queryInterface.removeColumn("patients", "phone");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("patients", "userId");
    await queryInterface.addColumn("patients", "firstName", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("patients", "lastName", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("patients", "orgId", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("patients", "email", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("patients", "phone", {
      type: Sequelize.STRING,
    });
  },
};
