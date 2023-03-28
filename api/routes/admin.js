const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminCheckAuth = require("../middleware/admin-check-auth");
const AdminController = require("../controllers/admin");
const Helper = require("../helper/index");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Reject file
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg .gif and .jpeg format allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.post("/signup", AdminController.signup);

router.post("/login", AdminController.login);

router.post("/auth", adminCheckAuth, AdminController.auth);

router.put(
  "/update-profile",
  adminCheckAuth,
  upload.single("profile_pic"),
  AdminController.update_profile
);

router.put("/change-password", adminCheckAuth, AdminController.change_password);

module.exports = router;
