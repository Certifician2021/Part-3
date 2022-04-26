const mongoose = require('mongoose')
require('dotenv').config()


const url = process.env.MONGODB_URI
  mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Please provide a name...'],
    unique: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{5}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Please try in this format XXX-YYYYY`
    },
    minlength: 8,
    required: [true, 'Please provide a number']
  }
  })
  
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Person', personSchema)









