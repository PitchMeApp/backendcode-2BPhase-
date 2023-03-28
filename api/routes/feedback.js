const express = require("express");
const router = express.Router();

const makeRequest = require("../middleware/make-request");
const checkUserAuth = require("../middleware/user-check-auth");

const feedbackController = require("../controllers/feedback");

router.post("/add", feedbackController.add_feedback);
router.get("/get", feedbackController.get_feedback);

module.exports = router;
