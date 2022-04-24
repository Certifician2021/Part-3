const mongoose = require('mongoose')
require('dotenv').config()
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)


const url = 'mongodb+srv://fullstack:12345@cluster0.pbhgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

  mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
  }).set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  personSchema.plugin(uniqueValidator);
  module.exports = mongoose.model('Person', personSchema)









