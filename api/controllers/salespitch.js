const salespitchModel = require("../models/salespitch");
const FCMDB = require("../models/fcm");
const mongoose = require("mongoose");
const Helper = require("../helper/index");
const niv = require("node-input-validator");

exports.add = async (req, res, next) => {
  const validator = new niv.Validator(req.body, {
    industry: "required",
    title: "required",
  });
  const matched = await validator.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: validator.errors,
    });
  }
  const { type, title, industry, location, valueamount, services, servicesDetail, description, comment, status } = req.body;

  try {
    let createObj = {};
    createObj.type = type;
    createObj.title = title;
    createObj.industry = industry;
    createObj.location = location;
    createObj.valueamount = valueamount;
    createObj.services = services;
    createObj.servicesDetail = servicesDetail;
    createObj.description = description;
    createObj.comment = comment;
    createObj.status = status;
    if (req.files.file) {
      if (
        req.files.file[0].mimetype == "image/png" ||
        req.files.file[0].mimetype == "image/jpg" ||
        req.files.file[0].mimetype == "image/jpeg" ||
        req.files.file[0].mimetype == "image/gif" ||
        req.files.img1[0].mimetype == 'application/octet-stream' ||
        req.files.file[0].mimetype == "application/pdf"
      ) {
        createObj.file = req.files.file[0].path;
      } else {
        return res.status(500).json({
          message: "Only .png .jpg .jpeg and .gif format image files allowed!",
        });
      }
    } 
    if (req.files.img1) {
      if (
        req.files.img1[0].mimetype == "image/png" ||
        req.files.img1[0].mimetype == "image/jpg" ||
        req.files.img1[0].mimetype == "image/jpeg" ||
        req.files.img1[0].mimetype == 'application/octet-stream' ||
        req.files.img1[0].mimetype == "image/gif"
      ) {
        createObj.img1 = req.files.img1[0].path;
      } else {
        return res.status(500).json({
          message: "Only image files allowed!"+req.files.img1[0].mimetype,
        });
      }
    }
    if (req.files.img2) {
      if (
        req.files.img2[0].mimetype == "image/png" ||
        req.files.img2[0].mimetype == "image/jpg" ||
        req.files.img2[0].mimetype == "image/jpeg" ||
        req.files.img1[0].mimetype == 'application/octet-stream' ||
        req.files.img2[0].mimetype == "image/gif"
      ) {
        createObj.img2 = req.files.img2[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }
    if (req.files.img3) {
      if (
        req.files.img3[0].mimetype == "image/png" ||
        req.files.img3[0].mimetype == "image/jpg" ||
        req.files.img3[0].mimetype == "image/jpeg" ||
        req.files.img1[0].mimetype == 'application/octet-stream' ||
        req.files.img3[0].mimetype == "image/gif"
      ) {
        createObj.img3 = req.files.img3[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }
    if (req.files.img4) {
      if (
        req.files.img4[0].mimetype == "image/png" ||
        req.files.img4[0].mimetype == "image/jpg" ||
        req.files.img4[0].mimetype == "image/jpeg" ||
        req.files.img1[0].mimetype == 'application/octet-stream' ||
        req.files.img4[0].mimetype == "image/gif"
      ) {
        createObj.img4 = req.files.img4[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }
    if (req.files.vid1) {
      if (
        req.files.vid1[0].mimetype == "video/mp4" ||
        req.files.img1[0].mimetype == 'application/octet-stream' ||
        req.files.img1[0].mimetype == 'video/mov' ||
        req.files.vid1[0].mimetype == "video/quicktime"
      ) {
        createObj.vid1 = req.files.vid1[0].path;
      } else {
        return res.status(500).json({
          message: "Only .mp4 .mov format video files allowed!",
        });
      }
    }

    let result = new salespitchModel(createObj);

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
  const { type, title, industry, location, valueamount, services, servicesDetail, description, comment, status, img11, img22, img33, img44, file5, vid16 } = req.body;

  const updateObj = {};
  updateObj.type = type;
  updateObj.title = title;
  updateObj.industry = industry;
  updateObj.location = location;
  updateObj.valueamount = valueamount;
  updateObj.services = services;
  updateObj.servicesDetail = servicesDetail;
  updateObj.description = description;
  updateObj.comment = comment;
  updateObj.status = status;

  if (req.files.file) {
    if (
      req.files.file[0].mimetype == "image/png" ||
      req.files.file[0].mimetype == "image/jpg" ||
      req.files.file[0].mimetype == "image/jpeg" ||
      req.files.file[0].mimetype == "image/gif" ||
      req.files.img1[0].mimetype == 'application/octet-stream' ||
      req.files.file[0].mimetype == "application/pdf"
    ) {
      updateObj.file = req.files.file[0].path;
    } else {
      return res.status(500).json({
        message: "Only .png .jpg .jpeg and .gif format image files allowed!",
      });
    }
  } else{
      updateObj.file = file5;
  }
  if (req.files.img1) {
    if (
      req.files.img1[0].mimetype == "image/png" ||
      req.files.img1[0].mimetype == "image/jpg" ||
      req.files.img1[0].mimetype == "image/jpeg" ||
      req.files.img1[0].mimetype == 'application/octet-stream' ||
      req.files.img1[0].mimetype == "image/gif"
    ) {
      updateObj.img1 = req.files.img1[0].path;
    } else {
      return res.status(500).json({
        message: "Only .mp4 .mov format video files allowed!",
      });
    }
  } else{
      updateObj.img1 = img11;
  }
  if (req.files.img2) {
    if (
      req.files.img2[0].mimetype == "image/png" ||
      req.files.img2[0].mimetype == "image/jpg" ||
      req.files.img2[0].mimetype == "image/jpeg" ||
      req.files.img1[0].mimetype == 'application/octet-stream' ||
      req.files.img2[0].mimetype == "image/gif"
    ) {
      updateObj.img2 = req.files.img2[0].path;
    } else {
      return res.status(500).json({
        message: "Only .mp4 .mov format video files allowed!",
      });
    }
  } else{
      updateObj.img2 = img22;
  }
  if (req.files.img3) {
    if (
      req.files.img3[0].mimetype == "image/png" ||
      req.files.img3[0].mimetype == "image/jpg" ||
      req.files.img3[0].mimetype == "image/jpeg" ||
      req.files.img1[0].mimetype == 'application/octet-stream' ||
      req.files.img3[0].mimetype == "image/gif"
    ) {
      updateObj.img3 = req.files.img3[0].path;
    } else {
      return res.status(500).json({
        message: "Only .mp4 .mov format video files allowed!",
      });
    }
  } else{
      updateObj.img3 = img33;
  }
  if (req.files.img4) {
    if (
      req.files.img4[0].mimetype == "image/png" ||
      req.files.img4[0].mimetype == "image/jpg" ||
      req.files.img4[0].mimetype == "image/jpeg" ||
      req.files.img1[0].mimetype == 'application/octet-stream' ||
      req.files.img4[0].mimetype == "image/gif"
    ) {
      updateObj.img4 = req.files.img4[0].path;
    } else {
      return res.status(500).json({
        message: "Only .mp4 .mov format video files allowed!",
      });
    }
  } else{
      updateObj.img4 = img44;
  }
  if (req.files.vid1) {
    if (
      req.files.vid1[0].mimetype == "video/mp4" ||
      req.files.vid1[0].mimetype == 'application/octet-stream' ||
      req.files.vid1[0].mimetype == 'video/mov' ||
      req.files.vid1[0].mimetype == "video/quicktime"
    ) {
      updateObj.vid1 = req.files.vid1[0].path;
    } else {
      return res.status(500).json({
        message: "Only .mp4 .mov format video files allowed!",
      });
    }
  } else{
      updateObj.vid1 = vid16;
  }
  try {
    const result = await salespitchModel.findByIdAndUpdate(
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
    matchObj.status = Number(type);
  }
//   matchObj.flag = {
//     $in: [1, 2],
//   };

  try {
    const postAggregate = salespitchModel.aggregate([
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
          img1: 1,
          img2: 1,
          img3: 1,
          img4: 1,
          file: 1,
          vid1: 1,
          type: 1,
          industry: 1, location: 1, valueamount: 1, services: 1, servicesDetail: 1, description: 1, comment: 1, status: 1
        //   createdAt: 1,
          // flag: 1,
        },
      },
    ]);

    const result = await salespitchModel.aggregatePaginate(postAggregate, options);

    for (let i = 0; i < result.docs.length; i++) {
      const element = result.docs[i];
      if (element.file) {
        element.file = await Helper.getImageUrl(element.file);
      }
      if (element.img1) {
        element.img1 = await Helper.getImageUrl(element.img1);
      }
      if (element.img2) {
        element.img2 = await Helper.getImageUrl(element.img2);
      }
      if (element.img3) {
        element.img3 = await Helper.getImageUrl(element.img3);
      }
      if (element.img4) {
        element.img4 = await Helper.getImageUrl(element.img4);
      }
      if (element.vid1) {
        element.vid1 = await Helper.getImageUrl(element.vid1);
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
    const result = await salespitchModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },

    ]);

    // const result = await salespitchModel.aggregatePaginate(postAggregate, options);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      if (element.file) {
        element.file = await Helper.getImageUrl(element.file);
      }
      if (element.img1) {
        element.img1 = await Helper.getImageUrl(element.img1);
      }
      if (element.img2) {
        element.img2 = await Helper.getImageUrl(element.img2);
      }
      if (element.img3) {
        element.img3 = await Helper.getImageUrl(element.img3);
      }
      if (element.img4) {
        element.img4 = await Helper.getImageUrl(element.img4);
      }
      if (element.vid1) {
        element.vid1 = await Helper.getImageUrl(element.vid1);
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
  const status = req.body.status;
  let updateObj = {};
  updateObj.status = status;
  try {
    let message;
    if (status == 1) message = "Pitch has been successfully submitted";
    if (status == 2) message = "Pitch has been successfully enabled";
    if (status == 3) message = "Pitch has been successfully rejected";

    const result = await salespitchModel.findByIdAndUpdate(
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
  matchObj.status = {
    $in: [1, 2, 3, 4],
  };

  try {
    const result = await salespitchModel.aggregate([
      {
        $match: matchObj,
      },
      {
        $project: {
          title: 1,
          img1: 1,
          img2: 1,
          img3: 1,
          img4: 1,
          vid1: 1,
          file: 1,
          type: 1,
          industry: 1, 
          location: 1, 
          valueamount: 1, 
          services: 1, 
          servicesDetail: 1, 
          description: 1, 
          comment: 1, 
          status: 1
        }
      }
    ]);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      if (element.file) {
        element.file = await Helper.getImageUrl(element.file);
      }
      if (element.img1) {
        element.img1 = await Helper.getImageUrl(element.img1);
      }
      if (element.img2) {
        element.img2 = await Helper.getImageUrl(element.img2);
      }
      if (element.img3) {
        element.img3 = await Helper.getImageUrl(element.img3);
      }
      if (element.img4) {
        element.img4 = await Helper.getImageUrl(element.img4);
      }
      if (element.vid1) {
        element.vid1 = await Helper.getImageUrl(element.vid1);
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

exports.deleteall = async (req, res) => {
  const id = req.params.id;
//   let matchObj = {};
//   matchObj._id = mongoose.Types.ObjectId(id);

  try {
    const result = await salespitchModel.remove({_id:id});

    return res.status(200).json({
      message: "Salespitch has been deleted successfully  ",
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
