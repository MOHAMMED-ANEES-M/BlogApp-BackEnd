const express=require('express')
const app=express()
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');


var cors = require('cors');

app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/BlogApp')
  .then(() => console.log('Connected!'));

  const db=mongoose.connection

  app.use(express.json())



  const verifyToken=(req,res,next)=>{
    const token= req.headers['authorization'];
    console.log(token);

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

        const { username, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

         // Email validation using Mongoose schema validation
         const newUser = new User({ username, email, password });
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




  app.post('/login', async (req,res)=>{

    const  {username, email, password } = req.body
    console.log(req.body);

    try{
        if (email && password) {
            let response = await User.findOne({email})
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
    

    const response = await User.findByIdAndUpdate(id, req.body);

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }    
    
    console.log(response);
    res.json(response)
})




  app.listen(5000)
