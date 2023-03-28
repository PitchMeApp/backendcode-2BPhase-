const UserModel = require("../models/user");
const ProductModel = require("../models/product");
const mongoose = require("mongoose");
const cron = require("node-cron");
const moment = require("moment");

exports.getStatistics = async (req, res, next) => {
  const { start_date, end_date } = req.body;

  let matchObj = {
    flag: { $in: [1, 2] },
  };
  if (start_date && end_date) {
    matchObj.createdAt = {
      $gte: new Date(moment(start_date).format("YYYY-MM-DD")),
      $lte: new Date(moment(end_date).format("YYYY-MM-DD")),
    };
  }

  // if (parseInt(type) === 1) {
  //   matchObj = {
  //     createdAt: {
  //       $eq: new Date(moment(new Date()).format("YYYY-MM-DD")),
  //     },
  //   };
  // }
  // if (parseInt(type) === 2) {
  //   let now = new Date();
  //   const backdate = new Date(now.setDate(now.getDate() - 30));
  //   matchObj = {
  //     createdAt: {
  //       $gte: new Date(moment(backdate).format("YYYY-MM-DD")),
  //       $lte: new Date(moment(new Date()).format("YYYY-MM-DD")),
  //     },
  //   };
  // }

  try {
    const users = await UserModel.countDocuments(matchObj);

    const allProductData = await ProductModel.aggregate([
      {
        $match: { flag: { $in: [1, 2] } },
      },
      { $count: "count" },
    ]);
    const availableProductData = await ProductModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $match: { flag: 1 },
      },
      { $count: "count" },
    ]);

    const soldProductData = await ProductModel.aggregate([
      {
        $match: matchObj,
      },
      { $match: { is_sold: 2 } },
      { $count: "count" },
    ]);

    const soldProductAmount = await ProductModel.aggregate([
      {
        $match: matchObj,
      },
      { $match: { is_sold: 2 } },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$sold_price" },
        },
      },
    ]);

    const result = {
      totalUsers: users,
      totalProducts: allProductData.length > 0 ? allProductData[0].count : 0,
      availableProducts:
        availableProductData.length > 0 ? availableProductData[0].count : 0,
      soldProducts: soldProductData.length > 0 ? soldProductData[0].count : 0,
      soldProductsAmount:
        soldProductAmount.length > 0 ? soldProductAmount[0].totalPrice : 0,
    };

    res.status(201).json({
      message: "Dashboard data returned successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};
