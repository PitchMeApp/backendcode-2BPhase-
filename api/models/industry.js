const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const industrySchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

industrySchema.plugin(aggregatePaginate);
industrySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Industry", industrySchema);
