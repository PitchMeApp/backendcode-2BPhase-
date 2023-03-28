const NotificationDB = require("../models/notification");
const moment = require("moment");
const fs = require("fs");
const { promisify } = require("util");
const admin = require("firebase-admin");
// const serviceAccount = require("../../megabox-480ab-firebase-adminsdk-qkunp-2793d0ab53.json");

// const firebaseApp = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://megabox-480ab-default-rtdb.firebaseio.com"
// });

exports.generateRandomString = (length, isNumber = false) => {
  var result = "";
  if (isNumber) {
    var characters = "0123456789";
  } else {
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  z;
};

exports.getValidImageUrl = async (filename, name = "SH") => {
  console.log(true);
  if (filename === "" || filename === undefined || filename === null) {
    filename =
      "https://ui-avatars.com/api/?name=" +
      name +
      "&rounded=true&background=c39a56&color=fff&format=png";
  } else {
    filename = process.env.URL + "uploads/" + filename;
  }
  return filename;
};

exports.getImageUrl = async (filename, name = "SH") => {
  if (filename === "" || filename === undefined || filename === null) {
    filename =
      "https://ui-avatars.com/api/?name=" +
      name +
      "&rounded=true&background=c39a56&color=fff&format=png";
  } else {
    filename = process.env.URL + filename;
  }
  return filename;
};

exports.writeErrorLog = async (req, error) => {
  const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
  const requestBody = JSON.stringify(req.body);
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  fs.appendFileSync(
    "errorLog.log",
    "REQUEST DATE : " +
      date +
      "\n" +
      "API URL : " +
      requestURL +
      "\n" +
      "API PARAMETER : " +
      requestBody +
      "\n" +
      "Error : " +
      error +
      "\n\n"
  );
};

exports.getSlugName = (title) => {
  const titleLOwerCase = title.toLowerCase();
  const slug = titleLOwerCase.replace(/ /g, "-");
  return slug;
};

exports.addNotification = async (title, text, type) => {
  const newNotificationObj = new NotificationDB({
    title,
    text,
    type,
  });
  const result = await newNotificationObj.save();
  return result;
};

exports.toCapitalize = (str) => {
  let first = str.charAt(0);
  first = first.toUpperCase();

  let remaining = str.slice(1);
  remaining = remaining.toLowerCase();

  return first + remaining;
};

exports.call_msg_notification = async (registration_ids, messages) => {
  const message = {
    notification: {
      title: messages.title,
      body: messages.body,
    },
    tokens: registration_ids,
    data: {
      title: messages.title,
      body: messages.body,
      notification_type: String(messages.type),
      id: String(messages.id),
      shipType: messages.shipType ? String(messages.shipType) : "",
      chat_id: messages.chat_id ? String(messages.chat_id) : "",
      click_action: "FLUTTER_NOTIFICATION_CLICK",
    },
  };
  // console.log(message)
  admin
    .messaging()
    .sendMulticast(message)
    .then(async (result) => {
      console.log(result);
    })
    .catch(async (err) => {
      console.log(err);
    });
};

exports.call_msg_ios_notification = async (registration_ids, messages) => {
  const message = {
    notification: {
      title: messages.title,
      body: messages.body,
    },
    tokens: registration_ids,
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: Number(messages.bedge),
        },
      },
    },
    data: {
      type: String(messages.type),
      chat_id: messages.chat_id ? String(messages.chat_id) : "",
    },
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then(async (result) => {
      console.log(result);
    })
    .catch(async (err) => {
      console.log(err);
    });
};
