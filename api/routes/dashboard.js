const express = require("express");
const router = express.Router();
const Helper = require("../helper/index");
const makeRequest = require("../middleware/make-request");
const checkAdminAuth = require("../middleware/admin-check-auth");
const checkAdminUserAuth = require("../middleware/admin-or-user-check-auth");

const dashboardController = require("../controllers/dashboard");

router.post(
  "/get-data",
  makeRequest,
  checkAdminAuth,
  dashboardController.getStatistics
);

module.exports = router;
