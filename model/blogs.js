const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
    },
  content: { 
    type: String, 
    minlength: 150,
    unique: true,
    required: true 
    },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
     }, 
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;