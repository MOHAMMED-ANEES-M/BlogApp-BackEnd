const express=require('express')
const app=express()
const mongoose = require('mongoose');
const User = require('./model/user');
const BlogPost = require('./model/blogs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');




var cors = require('cors');
const { default: isEmail } = require('validator/lib/isemail');

app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/BlogApp')
  .then(() => console.log('Connected!'));

  const db=mongoose.connection

  app.use(express.json())



  const verifyToken=(req,res,next)=>{
    const token= req.headers['authorization'];
    console.log(token,'token');

    if(!token){
        return res.status(403).json({ message: 'Token is not provided'})
    }

    jwt.verify(token,'abc',(err,decoded)=>{
        if(err){
            return res.status(401).json({message: 'Unauthorized: Invalid token'})
        }
        req.decoded= decoded
        console.log(req.decoded);
        next();
    });
  };


  const verifyAdmin = async (req, res, next) => {

    const email = req.body.email; 
    const password = req.body.password;

    if (req.body.email === "admin@gmail.com" && req.body.password === "11111") {
      const token = jwt.sign({ id: express.response.id, username: express.response.username }, 'abc');
      res.locals.adminToken = token
      console.log('token: ',token);
    }
    next();
  };

  

  

  app.get('/find', verifyToken, async (req,res)=>{
    let response=await User.find()
    console.log(response);
    res.json(response)
  })

  app.get('/findProfile', verifyToken, async (req,res)=>{
    const { id } = req.query;
    console.log(req.query,'profilebody');
    try{

        let response=await User.findOne({_id: req.query.id})
        console.log('response',response);
        res.json(response)
    }catch(err){
        console.log('Error:', err.message);
        res.status(500).json({ message: err.message })
    }
  })


  app.post('/insert', async (req,res)=>{

    console.log(req.body);

    try{

        const { username, email, password, name, bio, number, state, country } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const newUser = new User({ username, email, password, name, bio, number, state, country });

        // Email validation using Mongoose schema validation
         const validationError = newUser.validateSync();
         if (validationError && validationError.errors && validationError.errors.email) {
             return res.status(400).json({ message: validationError.errors.email.message });
         }

        const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);
        newUser.password = hashedPassword;
        let response = await newUser.save()
        console.log(response);
        res.json(response)
    }catch(err){
        console.log('Error:', err.message);
        res.status(500).json({ message: err.message })
    }

  })




  app.post('/login', verifyAdmin, async (req,res)=>{

    const  {username, email, password } = req.body
    console.log(req.body);

    try{
        if (email && password) {

          token = res.locals.adminToken

          let response = await User.findOne({email})
          
          if (token) {
            return res.status(200).json({ admin: true, token, username: response.username, id: response.id });
          }
          
            console.log(response);
            if (response) {
                const passwordMatch = await bcrypt.compare(password,response.password);

                if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
                }        
                
                const token = jwt.sign({ id: response.id, username: response.username },'abc');
                res.json({status:true,username: response.username, token, id: response.id})
                console.log('token',token);
            }
            else{
                res.json({status:false})
            }
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
  })

  app.put('/update/:id',async(req,res)=>{

    let id =req.params.id
    const  {username, email, name, bio, number, state, country } = req.body


    try{

      const requiredFields = {username, email, name, bio, number, state, country };
    
      for (const field in requiredFields) {
        if (!requiredFields[field]) {
            const errorMessage = `The field '${field}' is required.`;
            return res.status(400).json({ message: errorMessage });
        }
        }
    
        if ( number.toString().length !== 10 ) {
          const errorMessage = 'Number must be a valid number with a length of 10 digits.';
          return res.status(400).json({ message: errorMessage });
      }

      const isValidEmail = emailValidator.validate(email);

      if (!isValidEmail) {
        res.status(400).json({ message: 'Invalid email address' });
        return;
      }

      const stringFields = { username, name, bio, state, country }

      for(const field in stringFields){

        const isTextOnly = /^[a-zA-Z ]+$/.test(stringFields[field]);
        if ( !isTextOnly ) {
          const errorMessage = `${field} doesn't allow special characters.`;
          return res.status(400).json({ message: errorMessage });
      }

        if ( stringFields[field].toString().length < 3 ) {
          const errorMessage = `${field} must be with a length of at least 3 digits.`;
          return res.status(400).json({ message: errorMessage });
      }

  }
        
        const response = await User.findByIdAndUpdate(id, req.body);
        
        if (!response) {
            return res.status(404).json({ message: 'User not found' });
          }    
          
          console.log(response);
          res.json(response)
        
    }catch(err){
      console.log(err.message);
      res.status(500).json({ message: err.message });
    }
})

app.post('/write', async (req,res)=>{

  const {title,content,author}=req.body
  console.log(req.body);
  try{
    let newPost=new BlogPost(req.body)
    let response=await newPost.save()
    console.log(response);
    res.json(response)
}
catch(err){
    console.log(err.message);
    res.status(500).json({ message: err.message })
}
})


app.get('/findBlog', async (req,res)=>{
  let response=await BlogPost.find()
  // console.log(response);
  res.json(response)
})


app.get('/findOneBlog/:id',async(req,res)=>{
  let id =req.params.id
  console.log(id,'id');
  try{

    const response = await BlogPost.findById(id);
    
    if (!response) {
      return res.status(404).json({ message: 'Blog not found' });
    }    
    
    console.log(response,'response');
    res.json(response)
  }catch(err){
    console.log(err.message);
    res.status(500).json({ message: err.message })
  }
})



app.delete('/deleteBlog/:id', async (req,res)=>{
  let id =req.params.id
  let response = await BlogPost.findByIdAndDelete(id)
  res.json(response)
  console.log(response);
})


  app.listen(5000)
