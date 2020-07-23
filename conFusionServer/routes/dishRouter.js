const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(dishes)
    }, (err) => next(err))
    .catch((err)=>{
        next(err)
    })
}).
post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("Dish created" + dish);
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(dish);
    }, (err) => next(err)).catch((err)=> next(err));
}).
put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported operation here ')
}).
delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({}).then((resp)=>{
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err)).catch((err) => next(err));
})

dishRouter.route('/:dishID')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishID).populate('comments.author'). then((dish)=>{
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err)).catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST is not supported operation here')
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    req.body.price = (req.body.price/100).toFixed(2);
    console.log(req.body);
    Dishes.findByIdAndUpdate(req.params.dishID, {$set : req.body }, {new :true})
    .then((dish)=>{
         res.statusCode = 200;
         res.setHeader('content-type', 'application/json');
         res.json(dish);
    }, (err)=> next (err)) .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishID).then((resp) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(resp);
    }, (err) => next(err)).catch((err) => next(err));
})



module.exports = dishRouter;