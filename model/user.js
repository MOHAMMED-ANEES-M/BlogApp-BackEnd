const mongoose=require('mongoose')
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    username : {
        unique : true,
        type : String,
        minlength : 3,
        required : true,
    },
    email : {
        unique : true,
        type : String,
        minlength : 3,
        required : true,
        validate: {
            validator: value => isEmail(value),
            message: 'Invalid email address',
        },
    },
    password : {
        type : String,
        minlength : 3,
        required : true,
    },
    name: {
        type: String,
        minlength: 3,
        required: true,
      },
      bio: {
        type: String,
        minlength: 3,
        required: true,
      },
      number: {
        type: Number,
        min: 1000000000,
        max: 9999999999,
        required: true,
      },
      state: {
        type: String,
        minlength: 3,
        required: true,
      },
      country: {
        type: String,
        minlength: 3,
        required: true,
      },
})


const User = mongoose.model('User',userSchema,'users');


module.exports=User