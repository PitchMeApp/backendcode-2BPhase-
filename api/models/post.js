const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: true,
    // },
    type: {
      type: Number,
      required: true, // 1 article, 2 image, 3 video
    },
    file: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    flag: {
      type: Number,
      default: 1, //1=activated 2=deactivated 3=delete
    },
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(aggregatePaginate);
postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", postSchema);
