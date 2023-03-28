const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./api/config/db");

const adminRoutes = require("./api/routes/admin");
const postRoutes = require("./api/routes/post");
const industryRoutes = require("./api/routes/industry");
const servicesRoutes = require("./api/routes/services");
const userRoutes = require("./api/routes/user");
const salespitchRoutes = require("./api/routes/salespitch");
// const labelRoutes = require("./api/routes/label");
// const appProductRoutes = require("./api/routes/app_product");
// const adminProductRoutes = require("./api/routes/admin_product");
// const offerRoutes = require("./api/routes/offer");
// const favouriteRoutes = require("./api/routes/favourite");
// const reviewRoutes = require("./api/routes/review");
// const cmsRoutes = require("./api/routes/cms");
const notificationRoutes = require("./api/routes/notification");
const feedbackRoutes = require("./api/routes/feedback");
const settingRoutes = require("./api/routes/setting");
// const reportRoutes = require("./api/routes/report");
// const resizeRoutes = require("./api/routes/resize");
// const dashboardRoutes = require("./api/routes/dashboard");

//
mongoose.Promise = global.Promise;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/reports", express.static("reports"));
app.use("/img", express.static("img"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/admin", adminRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/salespitch", salespitchRoutes);
// app.use("/api/label", labelRoutes);
// app.use("/api/product", appProductRoutes);
// app.use("/api/product/offer", offerRoutes);
// app.use("/api/admin/product/", adminProductRoutes);
// app.use("/api/favourite", favouriteRoutes);
// app.use("/api/review", reviewRoutes);
// app.use("/api/cms", cmsRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/settings", settingRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/resize", resizeRoutes);
// app.use("/api/dashboard", dashboardRoutes);

//
app.use("/cancel", (req, res) => {
  console.log("cancel");
  console.log(req);
});
app.use("/success", (req, res) => {
  console.log("success");
  console.log(req);
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
