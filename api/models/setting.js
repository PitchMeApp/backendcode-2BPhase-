const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const settingSchema = new mongoose.Schema({
  investors: {
    number: { type: Number, default: 0 },
    daily_increase: { type: Number, default: 0 },
  },
  business: {
    number: { type: Number, default: 0 },
    daily_increase: { type: Number, default: 0 },
  },
  raised_funds: {
    number: { type: Number, default: 0 },
    daily_increase: { type: Number, default: 0 },
  },
  verified_funds: {
    number: { type: Number, default: 0 },
    daily_increase: { type: Number, default: 0 },
  },
  cities: {
    number: { type: Number, default: 0 },
    daily_increase: { type: Number, default: 0 },
  },
  countries: {
    number: { type: Number, default: 0 },
    daily_increase: { type: Number, default: 0 },
  },
  continents: {
    number: { type: Number, default: 0 }
  },
});

settingSchema.plugin(aggregatePaginate);
settingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Setting", settingSchema);
