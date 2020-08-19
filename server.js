const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
app.use(bodyParser.json());

const User=require('./models/User');
mongoose.connect('mongodb://localhost/userData')

const bcrypt = require('bcrypt');
const saltRounds = 10;

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})

function sendResponse(res,err,data){
  if (err){
    res.json({
      success: false,
      message: err
    })
  } else if (!data){
    res.json({
      success: false,
      message: "Not Found"
    })
  } else {
    res.json({
      success: true,
      id:data.id,
      name:data.name,
      email:data.email,
      password:data.password
    })
  }
}


// CREATE
app.post('/users',(req,res)=>{
  User.create(
    {
      name:req.body.newData.name,
      email:req.body.newData.email,
      password: bcrypt.hashSync(req.body.newData.password, saltRounds)
    },
    (err,data)=>{sendResponse(res,err,data)})
})


app.post('/checkuser',(req,res)=>{
  User.findOne({email:req.body.email},(err,data)=>{
    if (err){
      res.json({
        success: false,
        message: err
      })
    } else if (!data){
      res.json({
        success: false,
        message: "Email Not Found!"
      })
    } else if(!bcrypt.compareSync(req.body.password,data.password)) {
      res.json({
        success: true,
        message: "Password Incorrect!"
      })
    }
    else{
      res.json({
        success: true,
        message: "Correct Password!"
      })
    }
  })
})


app.route('/users/:id')
// READ
.get((req,res)=>{
  User.findById(req.params.id,(err,data)=>{sendResponse(res,err,data)})
  // const user= User.findById(req.params.id)
  // res.json({
  //   success:true,
  //   data:user
  // })
  //res.send(user)
  //res.send("done")
})
// UPDATE
.put((req,res)=>{
  console.log("update hit");
  User.findByIdAndUpdate(
    req.params.id,
    {
      name:req.body.newData.name,
      email:req.body.newData.email,
      password: bcrypt.hashSync(req.body.newData.password, saltRounds)
    },
    {
      new:true
    },
    (err,data)=>{
      sendResponse(res,err,data)
    }
  )
})
// DELETE
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data)=>{
      sendResponse(res,err,data)
    }
  )
})