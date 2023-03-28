const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const salespitchSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      default: "", // 1 article, 2 image, 3 video
    },
    type: {
      type: String,
      default: [], // 1 article, 2 image, 3 video
    },
    location: {
      type: String,
      default: "",
    },
    valueamount: {
      type: String,
      default: "0",
    },
    services: {
      type: String,
      default: "",
    },
    servicesDetail: {
      type: String,
      default: "",
    },
    img1: {
      type: String,
      default: "",
    },
    img2: {
      type: String,
      default: "",
    },
    img3: {
      type: String,
      default: "",
    },
    img4: {
      type: String,
      default: "",
    },
    file: {
      type: String,
      default: "",
    },
    vid1: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 1, //1=pending 2=active 3=rejected 4=delete
    },
  },
  {
    timestamps: true,
  }
);

salespitchSchema.plugin(aggregatePaginate);
salespitchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Salespitch", salespitchSchema);
