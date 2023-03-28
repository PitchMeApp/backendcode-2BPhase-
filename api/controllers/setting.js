const settingModel = require("../models/setting");
const mongoose = require("mongoose");
const cron = require("node-cron");

exports.update = async (req, res, next) => {
  const {
    no_of_investors,
    investors_daily_increase,
    no_of_business,
    business_daily_increase,
    no_of_raised,
    raised_daily_increase,
    no_of_verified,
    verified_daily_increase,
    no_of_cities,
    cities_daily_increase,
    no_of_countries,
    countries_daily_increase,
    no_of_continents,
  } = req.body;
  let result;
  try {
    let setting = await settingModel.findOne();
    if (!setting) {
      result = await new settingModel({
        "investors.number": no_of_investors,
        "investors.daily_increase": investors_daily_increase,
        "business.number": no_of_business,
        "business.daily_increase": business_daily_increase,
        "raised_funds.number": no_of_raised,
        "raised_funds.daily_increase": raised_daily_increase,
        "verified_funds.number": no_of_verified,
        "verified_funds.daily_increase": verified_daily_increase,
        "cities.number": no_of_cities,
        "cities.daily_increase": cities_daily_increase,
        "countries.number": no_of_countries,
        "countries.daily_increase": countries_daily_increase,
        "continents.number": no_of_continents,
      });
      await result.save();
    } else {
      let updateObj = {};

      if (no_of_investors) updateObj["investors.number"] = no_of_investors;
      if (investors_daily_increase)
        updateObj["investors.daily_increase"] = investors_daily_increase;
      if (no_of_business) updateObj["business.number"] = no_of_business;
      if (business_daily_increase)
        updateObj["business.daily_increase"] = business_daily_increase;
      if (no_of_raised) updateObj["raised_funds.number"] = no_of_raised;
      if (raised_daily_increase)
        updateObj["raised_funds.daily_increase"] = raised_daily_increase;
      if (no_of_verified) updateObj["verified_funds.number"] = no_of_verified;
      if (verified_daily_increase)
        updateObj["verified_funds.daily_increase"] = verified_daily_increase;
      if (no_of_cities) updateObj["cities.number"] = no_of_cities;
      if (cities_daily_increase)
        updateObj["cities.daily_increase"] = cities_daily_increase;
      if (no_of_countries) updateObj["countries.number"] = no_of_countries;
      if (countries_daily_increase)
        updateObj["countries.daily_increase"] = countries_daily_increase;
      if (no_of_continents) updateObj["continents.number"] = no_of_continents;

      result = await settingModel.findByIdAndUpdate(setting._id, {
        $set: updateObj,
      });
    }
    res.status(201).json({
      message: "Settings updated successfully",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

exports.get = async (req, res, next) => {
  try {
    let result = await settingModel.findOne({});

    res.status(201).json({
      message: "Settings fetched successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

exports.getInApp = async (req, res, next) => {
  try {
    let result = await settingModel.findOne({});

    res.status(201).json({
      message: "Settings fetched successfully",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occured. Please try again",
      error: err.message,
    });
  }
};

const update_settings = async () => {
  try {
    let settingResult = await settingModel.findOne();
    settingResult.investors.number =
      settingResult.investors.number + settingResult.investors.daily_increase;
    settingResult.business.number =
      settingResult.business.number + settingResult.business.daily_increase;
    settingResult.raised_funds.number =
      settingResult.raised_funds.number +
      settingResult.raised_funds.daily_increase;
    settingResult.verified_funds.number =
      settingResult.verified_funds.number +
      settingResult.verified_funds.daily_increase;
    settingResult.cities.number =
      settingResult.cities.number + settingResult.cities.daily_increase;
    settingResult.countries.number =
      settingResult.countries.number + settingResult.countries.daily_increase;
    // console.log(result);
    await settingResult.save();
  } catch (err) {
    console.log(err);
  }
};

let updates = new cron.schedule("05 00 * * *", async () => {
  console.log("start");
  await update_settings();
  console.log("end");
});

//5 0 * * *