const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  Provider,
  User,
  Organization,
  Patient,
  Password,
} = require("../models");
const jwt = require("jsonwebtoken");
const { flattenObject } = require("../utils/index");

const provider_controller = {};

//handles provider registration
provider_controller.create = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      middleName,
      email,
      orgId,
      phoneNumber,
      iamId,
      iamProvider,
      password,
      patientIds,
    } = req.body;

    if (!iamId && !password) {
      res.status(401);
      throw new Error("Required fields are missing!!");
    }

    if (await User.findOne({ where: { email } })) {
      res.status(401);
      throw new Error("Email is already linked with an account!!");
    }

    let organization = null;
    if (!orgId) {
      organization = await Organization.findOne({ where: { name: "Demo" } });
    } else {
      organization = await Organization.findOne({ where: { id: orgId } });
    }

    const provider = await Provider.create(
      {
        User: {
          orgId: organization.id,
          firstName,
          middleName,
          lastName,
          email,
          ...(iamId
            ? { iamId, iamProvider }
            : { password, iamProvider: "local" }),
          phoneNumber,
          isActive: true,
        },
      },
      { include: [User] }
    );

    if (patientIds?.length > 0) {
      patientIds.forEach(async (id) => {
        const patient = await Patient.findByPk(id);
        await provider.addPatient(patient);
      });
    }

    if (password) {
      await Password.create({
        userId: provider.User.id,
        password: await bcrypt.hash(password, 10),
      });
    }
    const token = jwt.sign({ id: provider.User.id }, process.env.TOKEN_KEY, {
      expiresIn: 360000000,
    });

    res.status(201).json({
      ...flattenObject(provider.toJSON()),
      id: provider.id,
      token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//to get all patients corresponding to the provider
provider_controller.patients = asyncHandler(async (req, res, next) => {
  try {
    const { providerId: provider_id } = req.params;

    const patient_ids = await Patient.findAll({
      where: {
        providerId: provider_id,
      },
    });

    return res.status(200).json({
      patient_ids,
    });
  } catch (error) {
    next(error);
  }
});

//get all the providers in the organization
provider_controller.getAllProviders = asyncHandler(async (req, res, next) => {
  try {
    const providers = await Provider.findAll();
    return res.status(200).json(providers);
  } catch (error) {
    next(error);
  }
});

//get the details for the given provider
provider_controller.getProvider = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const provider = await Provider.findOne({
    where: { userId: id },
    include: User,
  });

  const token = jwt.sign({ id: provider.User.id }, process.env.TOKEN_KEY, {
    expiresIn: 360000000,
  });

  return res
    .status(200)
    .json(
      provider
        ? { ...flattenObject(provider.toJSON()), id: provider.id, token }
        : {}
    );
});

provider_controller.getAllPatients = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const provider = await Provider.findOne({
    where: { userId: id },
    include: {
      model: Patient,
      // this is required to remove the join table detials from the result
      through: {
        attributes: [],
      },
      attributes: [
        "id",
        "height",
        "heightUom",
        "weight",
        "weightUom",
        "age",
        "userId",
        "sex",
        "status",
        "diagnosis",
      ],
      include: {
        model: User,
        attributes: [
          "firstName",
          "middleName",
          "lastName",
          "email",
          "phoneNumber",
          "isActive",
        ],
      },
    },
  });

  res.json(provider.toJSON().Patients.map((item) => flattenObject(item)));
});

module.exports = provider_controller;
