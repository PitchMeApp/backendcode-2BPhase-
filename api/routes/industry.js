const express = require("express");
const router = express.Router();
const multer = require("multer");
const Helper = require("../helper/index");
const checkAuth = require("../middleware/user-check-auth");
const industryController = require("../controllers/industry");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/industrys");
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

router.post("/", industryController.add);
router.put("/update/:id", industryController.update);
router.delete("/:id", industryController.deleteall);
router.get("/", industryController.get);
router.get("/detail/:id", industryController.getDetail);
router.get("/app/get", industryController.appGet);
module.exports = router;
