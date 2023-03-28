const express = require("express");
const router = express.Router();
const Helper = require("../helper/index");
const makeRequest = require("../middleware/make-request");
const checkUserAuth = require("../middleware/user-check-auth");
const notificationController = require("../controllers/notification");
// router.post('/add', makeRequest,  notificationController.add_notification);
router.get("/get", makeRequest, notificationController.get_notifications);
router.put("/read/:id", makeRequest, notificationController.read_notification);
router.delete(
  "/delete/:id",
  makeRequest,
  notificationController.delete_notification
);
router.get(
  "/getlimited",
  makeRequest,
  notificationController.getlimited_nofitication
);
router.post(
  "/readmultiple",
  makeRequest,
  notificationController.read_multiple_notification
);
module.exports = router;
