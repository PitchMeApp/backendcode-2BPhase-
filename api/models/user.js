const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile_number: {
      type: String,
    },
    uid: {
      type: String,
    },
    password: {
      type: String,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    email_verify: {
      type: Number,
      default: 0,
    },
    flag: {
      type: Number,
      default: 1, // 1=active, 2=deactivate 3 = deleted
    },
    type: {
      type: Number, //1=email, 2=google, 3=facebook, 4=apple
      default: 1,
    },
    log_type: {
      type: Number, //1=business idea, 2=business owner, 3=invester, 4=partner
      default: 0,
    },
    register_token: {
      type: String,
    },
    reset_pass_token: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(aggregatePaginate);
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
