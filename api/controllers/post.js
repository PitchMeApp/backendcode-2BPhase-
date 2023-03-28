const postModel = require("../models/post");
const FCMDB = require("../models/fcm");
const mongoose = require("mongoose");
const Helper = require("../helper/index");
const niv = require("node-input-validator");

exports.add = async (req, res, next) => {
  const validator = new niv.Validator(req.body, {
    type: "required",
  });
  const matched = await validator.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: validator.errors,
    });
  }
  const { type, text } = req.body;

  try {
    let createObj = {};
    createObj.type = type;

    if (type == 1) {
      createObj.text = text;
    } else if (type == 2 && req.file) {
      if (
        req.file.mimetype == "image/png" ||
        req.file.mimetype == "image/jpg" ||
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/gif"
      ) {
        createObj.file = req.file.path;
      } else {
        return res.status(500).json({
          message: "Only .png .jpg .jpeg and .gif format image files allowed!",
        });
      }
    } else if (type == 3 && req.file) {
      if (
        req.file.mimetype == "video/mp4" ||
        req.file.mimetype == "video/quicktime"
      ) {
        createObj.file = req.file.path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }

    let result = new postModel(createObj);

    await result.save();
    res.status(201).json({
      message: "Post has been successfully added",
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
  const { text, type } = req.body;

  const updateObj = {};

  if (type == 1 && text) {
    updateObj.text = text;
    updateObj.type = type;
    updateObj.file = "";
  } else if (type == 2 && req.file) {
    if (
      req.file.mimetype == "image/png" ||
      req.file.mimetype == "image/jpg" ||
      req.file.mimetype == "image/jpeg" ||
      req.file.mimetype == "image/gif"
    ) {
      updateObj.type = type;
      updateObj.file = req.file.path;
      updateObj.text = "";
    } else {
      return res.status(500).json({
        message: "Only .png .jpg .jpeg and .gif format image files allowed!",
      });
    }
  } else if (type == 3 && req.file) {
    if (
      req.file.mimetype == "video/mp4" ||
      req.file.mimetype == "video/quicktime"
    ) {
      updateObj.type = type;
      updateObj.file = req.file.path;
      updateObj.text = "";
    } else {
      return res.status(500).json({
        message: "Only .mp4 .mov format video files allowed!",
      });
    }
  }

  try {
    const result = await postModel.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "Post updated successfully",
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
  let { page, limit, search, type } = req.query;

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

  if (type) {
    matchObj.type = Number(type);
  }
  matchObj.flag = {
    $in: [1, 2],
  };

  try {
    const postAggregate = postModel.aggregate([
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
          title: 1,
          file: 1,
          text: 1,
          type: 1,
          createdAt: 1,
          flag: 1,
        },
      },
    ]);

    const result = await postModel.aggregatePaginate(postAggregate, options);

    for (let i = 0; i < result.docs.length; i++) {
      const element = result.docs[i];
      element.title = "title"
      if (element.file) {
        element.file = await Helper.getImageUrl(element.file);
      }
    }

    return res.status(200).json({
      message: "Posts has been retrieved ",
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
  let { search, type } = req.query;
  let matchObj = {};
  if (search) {
    matchObj.title = { $regex: search, $options: "i" };
  }
  if (type) {
    matchObj.type = Number(type);
  }
  matchObj.flag = 1;
  try {
    const result = await postModel.aggregate([
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
          title: 1,
          file: 1,
          text: 1,
          type: 1,
          createdAt: 1,
          flag: 1,
        },
      },
    ]);

    // const result = await postModel.aggregatePaginate(postAggregate, options);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      element.title = "title"
      if (element.file) {
        element.file = await Helper.getImageUrl(element.file);
      }
    }

    return res.status(200).json({
      message: "Posts has been retrieved ",
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

exports.change_status = async (req, res) => {
  const id = req.params.id;

  const Validator = new niv.Validator(req.body, {
    flag: "required|in:1,2,3",
  });

  const matched = await Validator.check();

  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: Validator.errors,
    });
  }
  const flag = req.body.flag;
  let updateObj = {};
  updateObj.flag = flag;
  try {
    let message;
    if (flag == 1) message = "Post has been successfully enabled";
    if (flag == 2) message = "Post has been successfully disabled";
    if (flag == 3) message = "Post has been successfully deleted";

    const result = await postModel.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );

    return res.status(202).json({
      message: message,
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
  matchObj.flag = {
    $in: [1, 2],
  };

  try {
    const result = await postModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $project: {
          title: 1,
          text: 1,
          file: 1,
          type: 1,
          createdAt: 1,
          flag: 1,
        },
      },
    ]);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      element.title = "title"
      if (element.file) {
        element.file = await Helper.getImageUrl(element.file);
      }
    }

    return res.status(200).json({
      message: "Post has been retrieved ",
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

const sendPushNotfication = async (title, description, type) => {
  try {
    let usertokens = await FCMDB.find({});
    let message = {};
    message.title = title;
    message.body = description;
    message.type = type;
    const android_list = new Array();
    const ios_list = new Array();
    usertokens.map((userToken) => {
      if (userToken.type == 1) {
        android_list.push(userToken.token);
      }
      if (userToken.type == 2) {
        ios_list.push(userToken.token);
      }
    });
    android_list.map(async (android_lists) => {
      const registration_id = new Array();
      registration_id.push(android_lists);
      await Helper.call_msg_notification(registration_id, message);
    });
    ios_list.map(async (ios_lists) => {
      const registration_id = new Array();
      registration_id.push(ios_lists);
      await Helper.call_msg_ios_notification(registration_id, message);
    });
  } catch (error) {
    console.log(error);
  }
};
