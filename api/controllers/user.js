const FCMDB = require("../models/fcm");
const UserModel = require("../models/user");
const Helper = require("../helper/index");
const Email = require("../helper/email");
const niv = require("node-input-validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");

// Register
exports.register = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    name: "required|maxLength:55",
    email: "required|email",
    password: "required|minLength:6",
    confirm_pass: "required|minLength:6",
  });

  const matched = await objValidation.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: objValidation.errors,
    });
  }
  if (matched) {
    const password = req.body.password;
    const confirm_pass = req.body.confirm_pass;
    if (password != confirm_pass) {
      return res.status(422).send({
        message: "Password does not match",
      });
    }
  }

  try {
    const userResult = await UserModel.findOne({
      email: req.body.email,
      flag: {
        $in: [1, 2],
      },
    });

    if (userResult) {
      return res.status(409).send({
        message: "User email already exists",
      });
    }
    const register_token = await Helper.generateRandomString(32);
    const hash = await bcrypt.hash(req.body.password, 10);

    const newUser = new UserModel({
      language: req.body.language,
      username: req.body.name,
      email: req.body.email,
      password: hash,
      flag: 1,
      type: req.body.type ? req.body.type : 1,
      register_token: register_token,
    });
    const result = await newUser.save();
    const title = "New User Registered";
    const text = `New User Registered User Name ${req.body.name}`;
    await Helper.addNotification(title, text, 1);

    // JWT token generate
    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "10d",
      }
    );
    return res.status(201).send({
      message: "New user created",
      token: token,
      user: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

// Login
exports.login = async (req, res, next) => {
  const objValidation = new niv.Validator(req.body, {
    email: "required|email",
    password: "required",
  });

  const matched = await objValidation.check();

  if (!matched) {
    return res.status(422).send(objValidation.errors);
  }

  try {
    let email = req.body.email;
    let userResult = await UserModel.aggregate([
      {
        $match: {
          email: email,
        },
      },

      {
        $project: {
          username: 1,
          email: 1,
          flag: 1,
          profile_pic: 1,
          email_verify: 1,
          mobile_number: 1,
          createdAt: 1,
          log_type: 1,
          password: 1,
          register_token: 1,
        },
      },
    ]);
    if (!userResult[0]) {
      return res.status(401).send({
        message: "Please enter valid credentials",
      });
    }
    userResult = userResult[0];
    if (userResult.email_verify != 1) {
      return res.status(409).send({
        message:
          "A confirmation link has been sent to your Email. Please verify email",
      });
    }

    if (userResult.flag == 2) {
      return res.status(409).send({
        message: "Your account is currently deactivated please contact admin",
      });
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      userResult.password
    );

    if (!checkPassword) {
      return res.status(401).send({
        message: "Please enter valid credentials",
      });
    }
    const token = jwt.sign(
      {
        email: userResult.email,
        id: userResult._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "10d",
      }
    );
    userResult.profile_pic = await Helper.getImageUrl(
      userResult.profile_pic,
      userResult.username
    );
    return res.status(200).send({
      message: "User has been successfully login",
      token: token,
      user: userResult,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

// Social
exports.social = async (req, res, next) => {
  const ObjValidation = new niv.Validator(req.body, {
    uid: "required",
  });

  let { uid, email, mobile_number, name, type } = req.body;

  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: ObjValidation.errors,
    });
  } else {
    const message = "";
    try {
      let userResult = await UserModel.findOne({
        $or: [{ email: email }, { uid: uid }],
      });

      if (!userResult) {
        if (!req.body.email) {
          return res.status(401).send({
            message: "Invalid User",
          });
        }

        let userObj = {};
        userObj = {
          username: name,
          uid: uid,
          email: email,
          type: type,
        };
        if (req.body.mobile_number) userObj.mobile_number = mobile_number;

        const newUser = new UserModel(userObj);
        const result = await newUser.save();

        // JWT token generate
        const token = jwt.sign(
          {
            email: result.email,
            id: result._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "10d",
          }
        );
        return res.status(201).send({
          message: "New user created",
          token: token,
          user: result,
        });
      } else if (userResult.email == email && userResult.uid != uid) {
        return res.status(402).send({
          message: "This email is already available. Try to login with email",
        });
      } else if (
        userResult.uid == uid ||
        (userResult.uid == uid && userResult.email == email)
      ) {
        if (userResult.flag == 2) {
          return res.status(409).send({
            message:
              "Your account is currently deactivated please contact admin",
          });
        }
        const token = jwt.sign(
          {
            email: userResult.email,
            id: userResult._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "10d",
          }
        );
        userResult.profile_pic = await Helper.getImageUrl(
          userResult.profile_pic,
          userResult.username
        );
        return res.status(200).json({
          message: "User has been successfully login",
          token: token,
          user: userResult,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: "Error occurred, Please try again later",
        error: err,
      });
    }
  }
};

// Get All User
exports.getAllUser = async (req, res, next) => {
  let page = req.query.page;
  let search = req.query.search;
  if (search === undefined) {
    search = "";
  }
  if (page === "" || page === 0 || page === undefined) {
    page = 1;
  }
  let limit = req.query.limit;
  if (limit === "" || limit === 0 || limit === undefined) {
    limit = 10;
  }
  var options = {
    page: page,
    limit: limit,
    sort: {
      createdAt: -1,
    },
  };
  let matchObj = {};
  matchObj.flag = {
    $in: [1, 2],
  };
  const userAggregate = UserModel.aggregate([
    {
      $project: {
        username: 1,
        email: 1,
        flag: 1,
        log_type: 1,
        profile_pic: 1,
        mobile_number: 1,
      },
    },
    {
      $match: {
        $or: [
          {
            username: {
              $regex: search,
              $options: "i",
            },
          },
          {
            mobile_number: {
              $regex: search,
              $options: "i",
            },
          },
        ],
        flag: {
          $in: [1, 2],
        },
      },
    },
  ]);

  try {
    const result = await UserModel.aggregatePaginate(userAggregate, options);

    for (let i = 0; i < result.docs.length; i++) {
      const element = result.docs[i];
      console.log(true);
      element.profile_pic = await Helper.getImageUrl(
        element.profile_pic,
        element.username
      );
    }

    return res.status(200).send({
      message: "User returned successfully",
      result: result,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

// Get User Detail
exports.getUserDetails = async (req, res) => {
  let id = req.userData._id;

  try {
    let result = await UserModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },

      {
        $project: {
          username: 1,
          email: 1,
          flag: 1,
          log_type: 1,
          profile_pic: 1,
          mobile_number: 1,
          email_notify: 1,
          createdAt: 1,
        },
      },
    ]);
    result = result[0];
    if (!result) {
      return res.status(500).send({
        message: "User doesn't exist",
      });
    }

    if (result.flag == 2) {
      return res.status(409).send({
        message: "Your account is currently deactivated please contact admin",
      });
    }
    result.createdAt = await moment(result.createdAt).format("MMM YYYY");
    result.profile_pic = await Helper.getImageUrl(
      result.profile_pic,
      result.username
    );
    return res.status(200).send({
      message: "User returned successfully",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

// Get User Detail for Admin
exports.getUserDetailsAdmin = async (req, res) => {
  let id = req.query.id;

  try {
    let result = await UserModel.findById(id).select({
      username: 1,
      email: 1,
      flag: 1,
      log_type: 1,
      profile_pic: 1,
      mobile_number: 1,
    });
    if (!result) {
      return res.status(500).send({
        message: "User doesn't exist",
      });
    }

    result.profile_pic = await Helper.getImageUrl(
      result.profile_pic,
      result.username
    );

    return res.status(200).send({
      message: "User returned successfully",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.getUserswoPage = async (req, res) => {
  let matchObj = {};
  matchObj.flag = {
    $in: [1],
  };

  try {
    const result = await UserModel.aggregate([
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
          username: 1,
          flag: 1,
          log_type: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Users have been retrieved ",
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

// Update User Status
exports.updateStatus = async (req, res, next) => {
  const objValidation = new niv.Validator(req.body, {
    userId: "required",
    flag: "required|numeric",
  });
  const matched = await objValidation.check();

  if (!matched) {
    return res.status(422).send(objValidation.errors);
  }

  try {
    const flag = req.body.flag;
    let message = "User has been enabled successfully";
    if (flag == 2) message = "User has been disabled successfully";
    if (flag == 3) {
      let title = "User Deleted";
      message = "User has been Deleted successfully";
      await Helper.addNotification(title, message, 2);
    }
    const result = await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          flag: flag,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: message,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: res,
    });
  }
};

// auth
exports.auth = async (req, res, next) => {
  try {
    let result = await UserModel.findById(req.userData._id);
    result.profile_pic = await Helper.getImageUrl(
      result.profile_pic,
      result.username
    );
    return res.status(200).json({
      message: "auth successfully",
      user: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Auth fail",
      error: err,
    });
  }
};

// edit
exports.edit = async (req, res) => {
  // id -> tanker
  const id = req.userData._id;

  const { username, mobile_number, email, password } = req.body;
  try {
    if (email) {
      let check = await UserModel.findOne({
        _id: { $ne: mongoose.Types.ObjectId(id) },
        flag: { $ne: 3 },
        email: {
          $regex: email,
          $options: "i",
        },
      });
      if (check) {
        return res.status(409).send({
          message: "This Email has been already used by another user",
        });
      }
    }
    if (mobile_number) {
      let check = await UserModel.findOne({
        _id: { $ne: mongoose.Types.ObjectId(id) },
        flag: { $ne: 3 },
        mobile_number: {
          $regex: mobile_number,
          $options: "i",
        },
      });
      if (check) {
        return res.status(409).send({
          message: "This mobile number has been already used by another user",
        });
      }
    }

    const updateObj = {};
    if (req.file) {
      updateObj.profile_pic = req.file.path;
    }
    if (username) updateObj.username = username;
    if (mobile_number) updateObj.mobile_number = mobile_number;
    if (email) updateObj.email = email;
    if (password) updateObj.password = await bcrypt.hash(password, 10);
    const result = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );
    if (result.profile_pic) {
      result.profile_pic = await Helper.getImageUrl(
        result.profile_pic,
        result.username
      );
    }
    return res.status(200).json({
      message: "User has been successfully updated",
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

// change password
exports.changePassword = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    old_password: "required",
    new_password: "required|minLength:6",
    confirm_password: "required|same:new_password",
  });
  const matched = await objValidation.check();

  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: objValidation.errors,
    });
  }
  let old_password = req.body.old_password;
  let new_password = req.body.new_password;

  try {
    const id = req.userData._id;
    const admin = req.userData;
    let passwordResult = await bcrypt.compare(old_password, admin.password);
    if (passwordResult == false) {
      return res.status(500).json({
        message: "Your old password is incorrect",
      });
    }
    const hash = await bcrypt.hash(new_password, 10);

    const result = await UserModel.findByIdAndUpdate(id, {
      $set: {
        password: hash,
      },
    });
    return res.status(200).json({
      message: "Password changed successfully",
      result: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
    });
  }
};

// change password admin
exports.changePasswordAdmin = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    new_password: "required|minLength:6",
  });
  const matched = await objValidation.check();

  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: objValidation.errors,
    });
  }
  let new_password = req.body.new_password;
  const id = req.params.id;

  try {
    const hash = await bcrypt.hash(new_password, 10);

    const result = await UserModel.findByIdAndUpdate(id, {
      $set: {
        password: hash,
      },
    });
    return res.status(200).json({
      message: "Password changed successfully",
      admin: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
    });
  }
};

// verify email
exports.verifyEmail = async (req, res) => {
  try {
    const new_register_token = await Helper.generateRandomString(8);
    const register_token = req.params.id;
    const exist = await UserModel.findOne({ register_token: register_token });
    console.log(exist);
    if (!exist) {
      return res.status(200).json({
        message: "Verification Request not found",
      });
    }
    const user = await UserModel.findOneAndUpdate(
      { register_token: register_token },
      {
        $set: { email_verify: 1, register_token: new_register_token },
      }
    );
    return res.status(200).json({
      message: "Email has been verified successfully",
      register_token: user,
    });
  } catch (err) {
    console.log(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

// send email
exports.sendEmail = async (req, res) => {
  try {
    const { email, type } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    let subject,
      token = "";
    if (type == 2) {
      const new_register_token = await Helper.generateRandomString(32);
      subject = `Pitch Me : Reset Password Request`;
      const check = await UserModel.findByIdAndUpdate(user._id, {
        reset_pass_token: new_register_token,
      });
      token = new_register_token;
    } else {
      subject = `Pitch Me : User Register Request`;
      token = user.register_token;
    }
    await Email.SendMail(email, subject, token, type);

    return res.status(200).json({
      message: "Email is send to your register email Id.",
      token: token,
    });
  } catch (err) {
    console.log(err);
    const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    const requestBody = JSON.stringify(req.body);
    const writeErrorRequest = Helper.writeErrorLog(
      requestURL,
      requestBody,
      err
    );
    console.error(err);
    res.status(500).json({
      message: "error occurred please try again",
      error: err.message,
    });
  }
};

exports.saveFCM = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    device: "required",
    type: "required",
    token: "required",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "validation error",
      error: ObjValidation.errors,
    });
  }
  try {
    let { device, type, token } = req.body;
    let user = req.userData._id;
    await FCMDB.deleteMany({ device: device });
    await FCMDB.create({
      user: user,
      device: device,
      type: type,
      token: token,
    });
    return res.status(201).send({
      message: "Successful",
    });
  } catch (err) {
    console.log(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

exports.logout = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    device: "required",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "validation error",
      error: ObjValidation.errors,
    });
  }
  try {
    await FCMDB.deleteMany({ device: req.body.device });
    return res.status(201).send({
      message: "Logout successfully",
    });
  } catch (err) {
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

exports.reset_password = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    token: "required",
    password: "required",
    confirm_pass: "required",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "validation error",
      error: ObjValidation.errors,
    });
  }
  try {
    if (req.body.password != req.body.confirm_pass) {
      return res.status(422).json({
        message: "Password and confirm password not matched",
      });
    }
    const user = await UserModel.findOne({
      reset_pass_token: req.body.token,
    });
    if (user.reset_pass_token.length == 8) {
      return res.status(422).json({
        message: "Token expired",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const new_register_token = await Helper.generateRandomString(8);

    const result = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          password: hash,
          reset_pass_token: new_register_token,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Password has been successfully changed",
      result: result,
    });
  } catch (err) {
    console.log(err);
    const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    const requestBody = JSON.stringify(req.body);
    const writeErrorRequest = Helper.writeErrorLog(
      requestURL,
      requestBody,
      err
    );
    res.status(500).json({
      message: "error occurred please try again",
      error: err.message,
    });
  }
};

// edit
exports.editType = async (req, res) => {
  // id -> tanker
  const id = req.userData._id;

  const { log_type } = req.body;
  try {
    const result = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { log_type: log_type },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "User has been successfully updated",
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};
