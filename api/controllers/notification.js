const notificationModel = require("../models/notification");
const niv = require("node-input-validator");
const Helper = require("../helper/index");
const mongoose = require("mongoose");
const user = require("../models/user");

exports.get_notifications = async (req, res) => {
  let { page, limit, type } = req.query;

  if ([1, "", 0, undefined, null].includes(page)) {
    page = 1;
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
  try {
    const notificationAggregate = notificationModel.aggregate([
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
          _id: 1,
          sender: 1,
          receiver: 1,
          postid: 1,
          title: 1,
          text: 1,
          unread_flag: 1,
          type: 1,
          createdAt: 1,
        },
      },
    ]);

    const result = await notificationModel.aggregatePaginate(
      notificationAggregate,
      options
    );

    var unread_notification = 0;
    result.docs.map((data) => {
      if (data.unread_flag == 0) {
        unread_notification += 1;
      }
    });

    return res.status(200).json({
      message: "Notifications have been retrieved ",
      result: result,
      unread_notification: unread_notification,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.read_notification = async (req, res) => {
  const id = req.params.id;

  const unread_flag = 1;
  let updateObj = {};
  updateObj.unread_flag = unread_flag;
  try {
    let message = "Notification is read";

    console.log(id, "id");
    const result = await notificationModel.findByIdAndUpdate(
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

exports.delete_notification = async (req, res) => {
  const id = req.params.id;

  try {
    let message = "Notification deleted successfully";

    const result = await notificationModel.findByIdAndDelete(id);

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

exports.read_multiple_notification = async (req, res) => {
  // const id = req.params.id;

  const unread_flag = 1;
  let updateObj = {};
  updateObj.unread_flag = unread_flag;
  try {
    let message = "Notification is read";
    req.body.ID.map(async (id) => {
      console.log(id, "id");
      const result = await notificationModel.findByIdAndUpdate(
        id,
        {
          $set: updateObj,
        },
        {
          new: true,
        }
      );
    });

    return res.status(202).json({
      message: message,
      // result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.getlimited_nofitication = async (req, res) => {
  try {
    const response = await notificationModel
      .find()
      .sort([["createdAt", -1]])
      .populate("postid")
      .limit(10);

    var unread_notification = 0;
    response.map((data) => {
      if (data.unread_flag == 0) {
        unread_notification += 1;
      }
    });
    return res.status(200).json({
      message: "Notifications have been retrieved ",
      result: response,
      unread_notification: unread_notification,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
