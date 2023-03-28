const express = require("express");
const router = express.Router();
const multer = require("multer");
const Helper = require("../helper/index");
const checkAuth = require("../middleware/user-check-auth");
const servicesController = require("../controllers/services");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/servicess");
  },
  filename: function (req, file, cb) {
    cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Reject file
  if (
    file.mimetype == "video/mp4" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .mp4 video format files allowed!"));
  }
};

const upload = multer({
  storage: storage,
});

router.post("/", servicesController.add);
router.put("/update/:id", servicesController.update);
router.delete("/:id", servicesController.deleteall);
router.get("/", servicesController.get);
router.get("/detail/:id", servicesController.getDetail);
router.get("/app/get", servicesController.appGet);
module.exports = router;
