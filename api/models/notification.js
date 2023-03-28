const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");
const notificationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId },
    receiver: { type: mongoose.Schema.Types.ObjectId },
    postid: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    unread_flag: { type: Number, default: 0 }, //0=unread,1=read
    type: { type: Number, default: 1 }, //1=userRegister, 2=userDeleted, 3=client, 4=Sale Report
  },
  { timestamps: true }
);
notificationSchema.plugin(aggregatePaginate);
notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Notification", notificationSchema);
