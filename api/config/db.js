const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGO_URL, {
    // useMongoClient:true
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then((res) => {
    console.log('Connect DB...')
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGO_UR}:${process.env.MONGO_PWD}@trudies.ycpdm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
//     {
//       // useMongoClient:true
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//     }
//   )
//   .then((res) => {
//     console.log('Connect DB...')
//   })
//   .catch((err) => {
//     console.log(err)
//     process.exit(1)
//   })
//
// mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority

exports.mongoose
