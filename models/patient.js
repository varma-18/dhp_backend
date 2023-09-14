"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Patient.hasMany(models.PatientActivity, {
        foreignKey: "patientId",
      });

      Patient.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Patient.belongsToMany(models.Provider, { through: "PatientProvider" });
    }
  }
  Patient.init(
    {
      age: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      heightUom: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      weightUom: DataTypes.STRING,
      sex: DataTypes.STRING,
      status: DataTypes.STRING,
      diagnosis: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Patient",
      tableName: "patients",
    }
  );
  return Patient;
};
