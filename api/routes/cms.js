const express = require("express");
const router = express.Router();
const makeRequest = require("../middleware/make-request");
const adminCheckAuth = require("../middleware/admin-check-auth");
const CMSController = require("../controllers/cms");
const moment = require("moment");
const multer = require("multer");

const storageDetails = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/cms/");
  },
  filename: function (req, file, cb) {
    cb(null, moment().format("YYYY-MM-DD-HH-MM-SS") + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storageDetails,
});

router.get("/", makeRequest, adminCheckAuth, CMSController.get);
router.post(
  "/add",
  makeRequest,
  adminCheckAuth,
  upload.single("banner_image"),
  CMSController.add
);
router.put(
  "/:id",
  makeRequest,
  adminCheckAuth,
  upload.single("banner_image"),
  CMSController.edit
);
router.patch("/:id", makeRequest, adminCheckAuth, CMSController.detail);
router.delete("/:id", makeRequest, adminCheckAuth, CMSController.deleteCms);
router.put(
  "/change-status/:id",
  makeRequest,
  adminCheckAuth,
  CMSController.changeStatus
);
router.get("/website", makeRequest, CMSController.getWebsite);
module.exports = router;
