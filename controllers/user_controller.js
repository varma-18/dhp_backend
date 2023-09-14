const {
  User,
  Password,
  Organization,
  Patient,
  Provider,
} = require("../models");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { flattenObject } = require("../utils");

const userController = {};

userController.create = async (req) => {
  const { firstName, middleName, lastName, email, iamId, orgId } = req.body;

  try {
    let organization = null;
    if (!orgId) {
      organization = await Organization.findOne({ where: { name: "Demo" } });
    } else {
      organization = await Organization.findOne({ where: { id: orgId } });
    }
    user = await User.create({
      orgId: organization.id,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      iamId: iamId,
      isActive: true,
    });
    return { success: true, user: user };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

userController.findAll = async (req) => {
  return await User.findAll();
};

userController.findByIamId = async (iamId) => {
  return await User.findOne({ where: { iamId: iamId } });
};

userController.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

userController.localLogin = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password) {
    throw new Error("Enter all the details");
  }

  const user =
    userType === "patient"
      ? await Patient.findOne({
          include: {
            model: User,
            where: {
              email,
            },
          },
        })
      : await Provider.findOne({
          include: {
            model: User,
            where: {
              email,
            },
          },
        });

  if (!user) {
    throw new Error(`This email is not linked with an account`);
  }

  const hashedPassword = await Password.findOne({
    where: { userId: user.User.id },
  });

  if (!hashedPassword) {
    throw new Error("You have not created a password!!");
  } else if (
    !(await bcrypt.compare(password, hashedPassword.dataValues.password))
  ) {
    throw new Error(`Incorrect email or password`);
  }

  const payload = {
    id: user.User.id,
    email: user.User.email,
  };

  const token = jwt.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: 360000000,
  });

  res.status(200).json({
    ...flattenObject(user.toJSON()),
    id: user.id,
    token: token,
  });
});

module.exports = userController;
