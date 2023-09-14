const asyncHandler = require("express-async-handler");

//connect to the database model
const { Patient, Organization, User, Provider } = require("../models");
const { flattenObject } = require("../utils");

const patientController = {};

patientController.findAll = async (req) => {
  return await Patient.findAll();
};

patientController.create = async (req) => {
  const {
    firstName,
    lastName,
    middleName,
    phoneNumber,
    email,
    age,
    height,
    heightUom,
    weight,
    weightUom,
    orgId,
    sex,
    status,
    diagnosis,
  } = req.body;

  console.log(req.body);

  try {
    let organization = null;
    if (!orgId) {
      organization = await Organization.findOne({ where: { name: "Demo" } });
    } else {
      organization = await Organization.findOne({ where: { id: orgId } });
    }

    const patient = await Patient.create(
      {
        age,
        sex,
        status,
        diagnosis,
        height,
        heightUom,
        weight,
        weightUom,
        User: {
          orgId: organization.id,
          firstName,
          middleName: middleName ?? "",
          lastName,
          email,
          phoneNumber,
          isActive: false,
        },
      },
      {
        include: [User],
      }
    );

    // Here the id of the provider trying to create the patient
    const provider = await Provider.findOne({ where: { userId: req.user.id } });

    await patient.addProvider(provider);

    return {
      success: true,
      patient: {
        ...flattenObject(patient.toJSON()),
        id: patient.id,
      },
    };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

patientController.findOne = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(401);
    throw new Error("Patiend Id is missing!!!");
  }

  const patient = await Patient.findOne({
    where: { userId: id },
    include: User,
  });

  res.json(
    patient ? { ...flattenObject(patient.toJSON()), id: patient.id } : null
  );
});

patientController.update = async (req) => {
  const patientId = req.params.patientId;
  const {
    firstName,
    lastName,
    phone,
    email,
    age,
    height,
    heightUom,
    weight,
    weightUom,
  } = req.body;
  try {
    let patient = await Patient.update(
      {
        firstName: firstName,
        phone: phone,
        lastName: lastName,
        email: email,
        age: age,
        height: height,
        heightUom: heightUom,
        weight: weight,
        weightUom: weightUom,
      },
      {
        where: { patientId },
      }
    );
  } catch (err) {}
  return { success: true, patient: patient };
};

patientController.destroy = async (req) => {
  const patientId = req.params.patientId;
  try {
    const patient = await Patient.destroy({ where: { patientId } });
    return { success: true, patient: patient };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

module.exports = patientController;
