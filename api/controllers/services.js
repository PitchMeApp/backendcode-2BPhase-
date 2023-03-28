const servicesModel = require("../models/services");
const FCMDB = require("../models/fcm");
const mongoose = require("mongoose");
const Helper = require("../helper/index");
const niv = require("node-input-validator");

exports.add = async (req, res, next) => {
  const validator = new niv.Validator(req.body, {
    name: "required",
    type: "required",
  });
  const matched = await validator.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      data: req.body,
      errors: validator.errors,
    });
  }
  const { name, type } = req.body;

  try {
    let createObj = {};
    createObj.name = name;
    createObj.type = type;

    let result = new servicesModel(createObj);

    await result.save();
    res.status(201).json({
      message: "services has been successfully added",
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
    type: "required",
  });
  const matched = await validator.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: validator.errors,
    });
  }

  const id = req.params.id;
  const { name, type } = req.body;

  const updateObj = {};

  if (name) {
    updateObj.name = name;
    updateObj.type = type;
  }
  try {
    const result = await servicesModel.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "services updated successfully",
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
    limit = 10;
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
    const servicesAggregate = servicesModel.aggregate([
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
          type: 1,
        },
      },
    ]);

    const result = await servicesModel.aggregatePaginate(servicesAggregate, options);

    return res.status(200).json({
      message: "servicess has been retrieved ",
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
    const result = await servicesModel.remove({_id:id});

    return res.status(200).json({
      message: "Service has been deleted successfully  ",
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
    const result = await servicesModel.aggregate([
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

    // const result = await servicesModel.aggregatePaginate(servicesAggregate, options);


    return res.status(200).json({
      message: "servicess has been retrieved ",
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
    const result = await servicesModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $project: {
          name: 1,
          type: 1,
        },
      },
    ]);


    return res.status(200).json({
      message: "services has been retrieved ",
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

