const mongoose=require('mongoose')

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
            validator: function (value) {
                // Use a regular expression for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
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
        minlength: 3,
        maxlength: 12,
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