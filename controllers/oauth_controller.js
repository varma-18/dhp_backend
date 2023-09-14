const axios = require("axios");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  getRedirectUrl,
  getProvider,
} = require("../oauth_providers/oauth_utils");
const SERVER_URL = process.env.SERVER_URL;
const TOKEN_KEY = process.env.TOKEN_KEY;
const { Patient, PatientInvite, User } = require("../models");

const oauth_authorize = asyncHandler((req, res) => {
  let provider = getProvider(req.query.provider);
  res.redirect(provider.getAuthUrl(req.query.source));
});

const oauth_redirect = asyncHandler(async (req, res) => {
  const { code, source } = req.query;

  const redirectUrl = getRedirectUrl(source);

  let provider = getProvider(req.params.provider);

  try {
    //Fetch the details of the authenticated user
    const provider_user_data = await provider.getUserData(code, source);

    let token;

    if (source !== "pivot_app_connect") {
      //Generate JWT token
      token = jwt.sign(
        {
          iamId: provider_user_data.id,
          email: provider_user_data.email,
        },
        TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      //TODO => Fix this flow later

      //Check if user already has an account, and get their ID
      const { data: user } = await axios({
        method: "GET",
        url: `${SERVER_URL}/users?email=${provider_user_data.email}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (user) {
        token = jwt.sign(
          {
            id: user.id,
          },
          TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.redirect(
          `${redirectUrl}?access_token=${token}&user_profile_exists=true&isActive=${user.isActive}&id=${user.id}`
        );
        return;
      }

      res.redirect(
        `${redirectUrl}?access_token=${token}&email=${
          provider_user_data.email
        }&name=${
          provider_user_data.name ? provider_user_data.name : ""
        }&iamId=${provider_user_data.id}&user_profile_exists=false&provider=${
          req.params.provider
        }`
      );
    } else {
      const userUpdate = await User.update(
        {
          iamId: provider_user_data.id,
          iamProvider: req.query.provider,
          isActive: true,
        },
        { where: { email: provider_user_data.email } }
      );

      if (userUpdate[0] === 0) {
        res.redirect(`${redirectUrl}?error=Email mismatch`);
        return;
      }

      const user = await User.findOne({
        where: { email: provider_user_data.email },
      });

      const patient = await Patient.findOne({
        where: { userId: user.id },
        include: User,
      });

      await PatientInvite.update(
        { hasExpired: true },
        { where: { patientId: patient.id } }
      );

      token = jwt.sign(
        {
          id: patient.User.id,
        },
        TOKEN_KEY,
        {
          expiresIn: 360000000,
        }
      );

      res.redirect(`${redirectUrl}?access_token=${token}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`${redirectUrl}?error=Authentication failed`);
  }
});

module.exports = { oauth_redirect, oauth_authorize };
