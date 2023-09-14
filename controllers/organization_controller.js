const asyncHandler = require("express-async-handler");
const express = require("express");

//getting the middlewares
const auth = require("../middleware/auth");

//connect to the router
var router = express.Router();

//connect to the database model
const db = require("../models");

const Organization = db.Organization;

const OrganizationController = {};

OrganizationController.findAll = async (req) => {
  return await Organization.findAll();
};

OrganizationController.create = async (req) => {
  const { name, description } = req.body;
  const orgId = req.Organization.orgId;
  try {
    const organization = await Organization.create({
      name: name,
      description: description,
      //id?
    });
    return { success: true, organization: organization };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

OrganizationController.findOne = async (req) => {
  const orgId = req.params.orgId;
  try {
    const organization = await Organization.findAll({
      where: { orgId: orgId },
    });
    return { success: true, organization: organization };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

OrganizationController.update = async (req) => {
  const orgId = req.params.orgId;
  const { name, description } = req.body;
  try {
    const organization = await Organization.update(
      {
        name: name,
        description: description,
      },
      { where: { orgId: orgId } }
      //req path var
    );
    return { success: true, organization: organization };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

OrganizationController.destroy = async (req) => {
  const orgId = req.params.orgId;
  try {
    const organization = await Organization.destroy({ where: { orgId } });
    return { success: true, organization: organization };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

module.exports = OrganizationController;
