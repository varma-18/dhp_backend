const router = require("express").Router();
const {
  getInviteDetails,
  createPatientInvites,
  acceptInvites,
  checkIfInvited,
} = require("../controllers/invite_controller");
const auth = require("../middleware/auth");

router.get("", getInviteDetails);

router.get("/:id", checkIfInvited);

router.post("/accept", acceptInvites);

router.post("", auth, createPatientInvites);

module.exports = router;
