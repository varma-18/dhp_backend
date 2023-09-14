const { PatientInvite, Patient, User, Password } = require("../models");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { flattenObject } = require("../utils");

const getInviteDetails = asyncHandler(async (req, res) => {
  const { inviteCode } = req.query;
  const invite = await PatientInvite.findOne({
    where: { inviteCode, hasExpired: false },
  });

  if (!invite) {
    res.status(401);
    throw new Error("Invalid invite code!!");
  }

  const patient = await Patient.findByPk(invite.patientId, {
    include: User,
  });

  res.status(200).json({ ...flattenObject(patient.toJSON()), id: patient.id });
});

const acceptInvites = asyncHandler(async (req, res) => {
  const { patientId, userId, password } = req.body;

  if (!password || !patientId || !userId) {
    res.status(401);
    throw new Error("Missing required fields!!");
  }

  await User.update(
    {
      iamProvider: "local",
      isActive: true,
    },
    { where: { id: userId } }
  );

  await PatientInvite.update({ hasExpired: true }, { where: { patientId } });

  await Password.create({
    userId,
    password: await bcrypt.hash(password, 10),
  });

  token = jwt.sign(
    {
      id: userId,
    },
    process.env.TOKEN_KEY,
    {
      expiresIn: 360000000,
    }
  );

  res.status(201).json(token);
});

const createPatientInvites = asyncHandler(async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    res.status(401);
    throw new Error("Patient id is required!!");
  }

  const patient = await Patient.findOne({ where: { id: patientId } });

  if (!patient) {
    res.status(401);
    throw new Error("Patient does not exist!!");
  }

  const existingInvite = await PatientInvite.findOne({ where: { patientId } });

  if (existingInvite) {
    res.json(existingInvite.toJSON());
    return;
  }

  const patientInvite = await PatientInvite.create({
    patientId,
  });

  res.json(patientInvite.toJSON());
});

const checkIfInvited = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invite = await PatientInvite.findOne({ where: { patientId: id } });

  res.json(invite ? invite.toJSON() : null);
});

module.exports = {
  getInviteDetails,
  createPatientInvites,
  acceptInvites,
  checkIfInvited,
};
