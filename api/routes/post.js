const express = require("express");
const router = express.Router();
const multer = require("multer");
const Helper = require("../helper/index");
const checkAuth = require("../middleware/user-check-auth");
const postController = require("../controllers/post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/posts");
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
  // limits: {
  //   fileSize: 1024 * 1024 * 10,
  // },
});

router.post("/", upload.single("file"), postController.add);
router.put("/update/:id", upload.single("file"), postController.update);
router.get("/", postController.get);
router.get("/app/get", postController.appGet);
router.put("/change_status/:id", postController.change_status);
router.get("/detail/:id", postController.getDetail);
module.exports = router;
