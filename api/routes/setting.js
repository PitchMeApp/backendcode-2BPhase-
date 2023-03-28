const checkAdminAuth = require("../middleware/admin-check-auth");
const settingController = require("../controllers/setting");
const makeRequest = require("../middleware/make-request");
const express = require("express");
const router = express.Router();

router.put("/update", makeRequest, checkAdminAuth, settingController.update);
router.get("/get", makeRequest, checkAdminAuth, settingController.get);
router.get("/app/get", makeRequest, settingController.getInApp);

module.exports = router;
