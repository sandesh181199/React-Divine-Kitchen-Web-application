var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');


var usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* GET users listing. */
usersRouter.options('*',cors.corsWithOptions, (req,res)=> { res.sendStatus(200); })

usersRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find({}). then(Users=>{
     res.statusCode = 200;
     res.setHeader('content-type', 'application/json');
     res.json(Users);
  }, (err)=>console.log(err)).catch(err=>{
    console.log(err);
  })
});

usersRouter.post('/signup',cors.corsWithOptions, (req, res, next) => {User.register(new User({ username: req.body.username }), req.body.password, 
(err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          err: err
        });
      } else {  
        if(req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err,user)=>{
          if(err)
            {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
                return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({
                success: true,
                status: 'Registration Successful!'
              });
            });
        })
      }
    });
});



usersRouter.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err,user,info)=>{
    if(err){
      return next(err);
    }
    if(!user){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login failed', err : info});
    }
    req.logIn(user, (err)=>{
      if(err){
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login failed', err : 'Could not login User'});
      }
     // console.log("inside login user =" +user);
      var token = authenticate.getToken({_id : req.user._id,admin: req.user.admin});
     // var userData = authenticate.jwtPassport();
     // console.log("inside login userData =" +userData);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successfull',token : token, admin:user.admin});
   });
  }) (req,res,next);
});


usersRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in');
    err.stack=403;
    next(err);
  }
})

usersRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('JWT', {session : false}, (err,user,info) =>{
    if(err)
      return next(err);
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid', success: false, err: info})
    }
    else{
       res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid', success: true, user: user});
    }
  }) (req,res);
})

module.exports = usersRouter;
