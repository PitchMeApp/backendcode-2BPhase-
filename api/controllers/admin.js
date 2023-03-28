const AdminModel = require('../models/admin')
const mongoose = require('mongoose')

const Helper = require('../helper/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const niv = require('node-input-validator')

exports.signup = async (req, res, next) => {
  const objValidation = new niv.Validator(req.body, {
    name: 'required|maxLength:55',
    email: 'required',
    password: 'required|minLength:6',
  })
  const matched = await objValidation.check()

  if (!matched) {
    return res
      .status(422)
      .send({ message: 'Validation error', errors: objValidation.errors })
  }

  try {
    const adminData = AdminModel.find({ email: req.body.email, flag: 1 })

    if (adminData.length > 0) {
      res.status(409).json({
        message: 'Email exists',
      })
    }

    const hash = await bcrypt.hash(req.body.password, 10)

    const admin = new AdminModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      name: req.body.name,
      profile_pic: '',
      password: hash,
      flag: 1,
    })

    const result = await admin.save()
    res.status(201).json({
      message: 'Admin register successfully',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Error occurred, Please try again later',
      error: err,
    })
  }
}

exports.login = async (req, res, next) => {
  const objValidation = new niv.Validator(req.body, {
    email: 'required',
    password: 'required',
  })
  const matched = await objValidation.check()

  if (!matched) {
    return res
      .status(422)
      .send({ message: 'Validation error', errors: objValidation.errors })
  }

  try {
    const admin = await AdminModel.findOne({ email: req.body.email })
    if (admin === null) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }
    const passwordResult = await bcrypt.compare(
      req.body.password,
      admin.password
    )
    if (passwordResult === false) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        email: admin.email,
        id: admin._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '10d',
      }
    )
    admin.profile_pic = await Helper.getImageUrl(
      admin.profile_pic,
      admin.name
    )

    return res.status(200).json({
      message: 'Auth Successfull',
      token: token,
      admin: admin,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Error occurred, Please try again later',
      error: err,
    })
  }
}

exports.auth = async (req, res, next) => {
  try {
    const admin = req.userData

    admin.profile_pic = await Helper.getImageUrl(
      admin.profile_pic,
      admin.name
    )
    return res.status(200).json({
      message: 'Profile returned successfully',
      admin: admin,
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Auth Fail',
      error: err,
    })
  }
}

exports.update_profile = async (req, res, next) => {
  const id = req.userData._id
  const updateObj = {}
  if (req.file) {
    updateObj.profile_pic = req.file.path
  }
  if (req.body.name) {
    updateObj.name = req.body.name
  }
  if (req.body.email) {
    updateObj.email = req.body.email
  }

  try {
    const admin = await AdminModel.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: 'Profile updated successfully', result: admin })
  } catch (err) {
    return res.status(500).json({
      message: 'Error occurred, Please try again later',
    })
  }
}

exports.change_password = async (req, res, next) => {
  const objValidation = new niv.Validator(req.body, {
    old_password: 'required|minLength:6',
    new_password: 'required|minLength:6',
  })
  const matched = await objValidation.check()

  if (!matched) {
    return res
      .status(422)
      .send({ message: 'Validation error', errors: objValidation.errors })
  }
  let old_password = req.body.old_password
  let new_password = req.body.new_password
  const id = req.userData._id
  const admin = req.userData

  try {
    const passwordResult = await bcrypt.compare(old_password, admin.password)
    if (passwordResult === false) {
      return res.status(500).json({
        message: 'Your old password is incorrect',
      })
    }
    const hash = await bcrypt.hash(new_password, 10)

    const result = await AdminModel.findByIdAndUpdate(id, {
      $set: { password: hash },
    })
    return res.status(200).json({
      message: 'Password changed successfully',
      admin: result,
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Error occurred, Please try again later',
    })
  }
}
