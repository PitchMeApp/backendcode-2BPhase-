const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const servicesSchema = mongoose.Schema(
  {
    type: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

servicesSchema.plugin(aggregatePaginate);
servicesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Services", servicesSchema);
