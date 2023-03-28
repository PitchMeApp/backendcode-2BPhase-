const mongoose = require('mongoose')
let aggregatePaginate = require('mongoose-aggregate-paginate-v2')
let mongoosePaginate = require('mongoose-paginate-v2')
const feedbackSchema = mongoose.Schema(
  {
    sender:{type: mongoose.Schema.Types.ObjectId},
    receiver:{type: mongoose.Schema.Types.ObjectId},
    title: { type: String  },
    postid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    star: { type: Number },
    videoStar:{type:Number},
    description:{type:String}
  },
  { timestamps: true }
)
feedbackSchema.plugin(aggregatePaginate)
feedbackSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Feedback', feedbackSchema)
