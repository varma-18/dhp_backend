"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });

      this.belongsToMany(models.Patient, { through: "PatientProvider" });
    }
  }
  Provider.init(
    {},
    {
      sequelize,
      modelName: "Provider",
      tableName: "providers",
    }
  );
  return Provider;
};
