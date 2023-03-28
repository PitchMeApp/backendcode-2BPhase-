const mongoose = require('mongoose')

const adminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    profile_pic: { type: String },
    flag: { type: Number, default: 1 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Admin', adminSchema)
