"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PatientProvider extends Model {}
  PatientProvider.init(
    {},
    {
      sequelize,
      modelName: "PatientProvider",
      tableName: "patientprovider",
    }
  );
  return PatientProvider;
};
