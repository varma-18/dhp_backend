const auth = require("./../middleware/auth");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const provider_controller = require("./../controllers/provider_controller");

/* fetch the details of all the providers */
router.get("", auth, provider_controller.getAllProviders);

router.get("/patients", auth, provider_controller.getAllPatients);

/* Fetch the details of the provider */
router.get("/:id", auth, provider_controller.getProvider);

/* create the provider */
router.post(
  "",
  [
    body("firstName", "ERR_FIRST_NAME_EMPTY").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("email", "ERR_EMAIL_INVALID_OR_EMPTY").exists().isEmail(),
    body("lastName", "ERR_LAST_NAME_EMPTY").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("middleName").optional(),
    body("phoneNumber").optional(),
    body("patientIds").optional(),
  ],
  async (req, res, next) => {
    provider_controller.create(req, res, next);
  }
);

module.exports = router;
