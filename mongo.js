const mongoose = require('mongoose')
require('dotenv').config()


const url = 'mongodb+srv://fullstack:12345@cluster0.pbhgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

  mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
  }).set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  
  module.exports = mongoose.model('Person', personSchema)









