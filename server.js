const mongoose = require("mongoose");
const app = require('./app')

const DB = process.env.DB_HOST;

mongoose.set('strictQuery', true)

mongoose.connect(DB).then(() => {
  app.listen(3000)
  console.log("Database connection successful")
}).catch (error => {
  console.log(error.message);
  process.exit(1);
})

