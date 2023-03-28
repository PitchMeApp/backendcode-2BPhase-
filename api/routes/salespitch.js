const express = require("express");
const router = express.Router();
const multer = require("multer");
const Helper = require("../helper/index");
const checkAuth = require("../middleware/user-check-auth");
const salespitchController = require("../controllers/salespitch");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/salespitch");
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
    file.mimetype == "image/gif" ||
    file.mimetype == "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .mp4 video format files allowed!"));
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 10,
  // },
});

router.post("/", upload.fields([
{ name: "file", maxCount: 1 },
{ name: "img1", maxCount: 1 },
{ name: "img2", maxCount: 1 },
{ name: "img3", maxCount: 1 },
{ name: "img4", maxCount: 1 },
{ name: "vid1", maxCount: 1 }]), salespitchController.add);
router.put("/update/:id", upload.fields([
{ name: "file", maxCount: 1 },
{ name: "img1", maxCount: 1 },
{ name: "img2", maxCount: 1 },
{ name: "img3", maxCount: 1 },
{ name: "img4", maxCount: 1 },
{ name: "vid1", maxCount: 1 }]), salespitchController.update);
router.get("/", salespitchController.get);
router.delete("/:id", salespitchController.deleteall);
router.get("/app/get", salespitchController.appGet);
router.put("/change_status/:id", salespitchController.change_status);
router.get("/detail/:id", salespitchController.getDetail);
module.exports = router;
