const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

/* GET users listing. */
router.get("", auth, async (req, res) => {
  const { iamId, email } = req.query;
  let myRes;
  if (email) {
    myRes = await userController.findByEmail(email);
  } else {
    myRes = req.query.iamId
      ? await userController.findByIamId(iamId)
      : await userController.findAll(req);
  }
  res.json(myRes);
});

//User local login route
router.post("/login", userController.localLogin);

// User registration route
router.post(
  "",
  [
    body("firstName", "ERR_FIRST_NAME_EMPTY").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("email", "ERR_EMAIL_INVALID_OR_EMPTY").exists().isEmail(),
    body("middleName").optional(),
    body("lastName", "ERR_LAST_NAME_EMPTY").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("iamId", "ERR_MISSING_IAM_ID").exists({
      checkNull: true,
      checkFalsy: true,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const myRes = await userController.create(req);
    if (myRes.success) {
      res.status(201).location(`/users/${myRes.user.id}`).end();
    } else {
      res.status(500).json({ errors: [myRes.error] });
    }
  }
);

module.exports = router;
