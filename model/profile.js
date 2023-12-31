const mongoose=require('mongoose')

const profileSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
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
        type: number,
        minlength: 3,
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

const User = mongoose.model('Profile',profileSchema,'user');
module.exports(User)