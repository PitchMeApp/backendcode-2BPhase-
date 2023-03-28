const industryModel = require("../models/industry");
const FCMDB = require("../models/fcm");
const mongoose = require("mongoose");
const Helper = require("../helper/index");
const niv = require("node-input-validator");

exports.add = async (req, res, next) => {
  const validator = new niv.Validator(req.body, {
    name: "required",
  });
  const matched = await validator.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      data: req.body,
      errors: validator.errors,
    });
  }
  const { name } = req.body;

  try {
    let createObj = {};
    createObj.name = name;

    let result = new industryModel(createObj);

    await result.save();
    res.status(201).json({
      message: "industry has been successfully added",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const validator = new niv.Validator(req.body, {
    name: "required",
  });
  const matched = await validator.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: validator.errors,
    });
  }

  const id = req.params.id;
  const { name } = req.body;

  const updateObj = {};

  if (name) {
    updateObj.name = name;
  }
  try {
    const result = await industryModel.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "industry updated successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

exports.get = async (req, res) => {
  let { page, limit, search } = req.query;

  if ([1, "", 0, undefined, null].includes(page)) {
    page = 1;
  }
  if (["", undefined, null].includes(search)) {
    search = "";
  }
  if ([1, "", 0, undefined, null].includes(limit)) {
    limit = 100;
  }
  let options = {
    page: page,
    limit: limit,
  };

  let matchObj = {};

//   if (name) {
//     matchObj.name = name;
//   }

  try {
    const industryAggregate = industryModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $project: {
          name: 1,
        },
      },
    ]);

    const result = await industryModel.aggregatePaginate(industryAggregate, options);

    return res.status(200).json({
      message: "industrys has been retrieved ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.deleteall = async (req, res) => {
  const id = req.params.id;
//   let matchObj = {};
//   matchObj._id = mongoose.Types.ObjectId(id);

  try {
    const result = await industryModel.remove({_id:id});

    return res.status(200).json({
      message: "Industry has been deleted successfully ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
exports.appGet = async (req, res) => {
  let { search } = req.query;
  let matchObj = {};
  if (search) {
    matchObj.name = { $regex: search, $options: "i" };
  }
  try {
    const result = await industryModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          name: 1,
        },
      },
    ]);

    // const result = await industryModel.aggregatePaginate(industryAggregate, options);


    return res.status(200).json({
      message: "industrys has been retrieved ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.getDetail = async (req, res) => {
  const id = req.params.id;
  let matchObj = {};
  matchObj._id = mongoose.Types.ObjectId(id);

  try {
    const result = await industryModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $project: {
          name: 1,
        },
      },
    ]);


    return res.status(200).json({
      message: "Industry has been retrieved ",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

