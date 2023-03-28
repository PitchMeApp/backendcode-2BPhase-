const express = require("express");
const checkUserAuth = require("../middleware/user-check-auth");
const checkAdminAuth = require("../middleware/admin-check-auth");
const router = express.Router();
const UserController = require("../controllers/user");
const multer = require("multer");
const Helper = require("../helper/index");
const makeRequest = require("../middleware/make-request");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users/");
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

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/social", UserController.social);
router.put("/edit", upload.single("profile_pic"), checkUserAuth, UserController.edit);
router.post("/update_status", UserController.updateStatus);
router.get("/detail", checkUserAuth, UserController.getUserDetails);
router.get("/detail_admin", UserController.getUserDetailsAdmin);
router.get("/all", UserController.getAllUser);
router.get("/admin/dropdown", UserController.getUserswoPage);
router.post("/change_password", checkUserAuth, UserController.changePassword);
router.put(
  "/admin/change_password/:id",
  makeRequest,
  checkAdminAuth,
  UserController.changePasswordAdmin
);
router.post("/send_mail", makeRequest, UserController.sendEmail);
router.get("/verify_mail/:id", makeRequest, UserController.verifyEmail);
router.post("/auth", makeRequest, checkUserAuth, UserController.auth);
router.post("/save-fcm", makeRequest, checkUserAuth, UserController.saveFCM);
router.post("/logout", makeRequest, checkUserAuth, UserController.logout);
router.post("/reset-password", makeRequest, UserController.reset_password);
router.put("/edit/type", makeRequest, checkUserAuth, UserController.editType);

module.exports = router;
