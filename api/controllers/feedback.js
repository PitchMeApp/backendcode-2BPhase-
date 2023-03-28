const Feedback = require("../models/feedback");
const User = require("../models/user");
const Notification = require("../models/notification");
const Post = require("../models/post");

exports.add_feedback = async (req, res) => {
  try {
    //fatch sender name
    const sender = await User.findById(req.body.senderid);
    const sender_name = sender.username;

    //fatch receiver name
    // const receiver =await User.findById(req.body.receiver)
    // const receiver_name = receiver.username

    //fatch file if user give feedback on post
    var title = "";
    if (req.body.postid) {
      // const post = await Post.findById(req.body.postid)
      // var post_file_name = post.file
      title = sender_name + " give feedback on your post ";
    } else {
      title = "You got feedback from " + sender_name;
    }

    const new_feedback = new Feedback({
      sender: req.body.senderid,
      receiver: req.body.receiverid,
      title: title,
      postid: req.body.postid,
      star: req.body.star,
      videoStar:req.body.videoStar,
      description: req.body?.description
        ? req.body.description
        : "You get feedback",
    });
    const feedback_res = await new_feedback.save();

    let message = "Notification and Feedback Add successfully";
    const new_notification = new Notification({
      sender: req.body.senderid,
      receiver: req.body.receiverid,
      postid: req.body.postid,
      title: title,
      text: req.body?.description
        ? req.body.description
        : "You get notification for feedback",
    });
    const result = await new_notification.save();

    return res.status(202).json({
      message: message,
      result: result,
      feedback: feedback_res,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
exports.get_feedback = async (req, res) => {
  try {
    const result = await Feedback.find();
    return res.status(202).json({
      message: "All feedback get successfully",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
