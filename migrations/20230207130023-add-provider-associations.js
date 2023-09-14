"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.removeColumn("providers", "firstName");
    await queryInterface.removeColumn("providers", "lastName");
    await queryInterface.removeColumn("providers", "email");
    await queryInterface.removeColumn("providers", "phoneNumber");
    await queryInterface.removeColumn("providers", "orgId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers", "userId");
    await queryInterface.addColumn("providers", "firstName", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("providers", "lastName", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("providers", "email", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("providers", "phoneNumber", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("providers", "orgId", {
      type: Sequelize.INTEGER,
    });
  },
};
