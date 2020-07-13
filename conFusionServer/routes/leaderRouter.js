const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const leaders = require('../models/leaders');
const authenticate = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); })
.get(cors.cors,(req, res, next) => {
    leaders.find(req.query)
    .then((leaders)=>{
        res.statusCode= 200;
        res.setHeader('content-type','application/json');
        res.json(leaders)
    }, (err) => next(err)).catch((err) => next(err));
}).
post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.create(req.body) .then((leader)=>{
        console.log('leader created');
         res.statusCode = 200;
         res.setHeader('content-type', 'application/json');
         res.json(leader)
    }, (err) => next(err)).catch((err) => next(err));
}).
put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported operation here ')
}).
delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.remove({}).then((resp)=>{
         res.statusCode = 200;
         res.setHeader('content-type', 'application/json');
         res.json(leader)
    },(err) => next(err)).catch((err) => next(err));
})

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); })
.get(cors.cors,(req, res, next) => {
        leaders.findById(req.params.leaderId).then((leader)=>{
            if(leader != null )
            {
                res.statusCode = 200;
                res.setHeader('content-type', 'application/json');
                res.json(leader)
            }
            else{
                res.statusCode= 403;
                res.end('Cannot find leader');
            }
        },(err) => next(err)).catch((err) => next(err))
    })
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST is not supported operation here')
    })
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        leaders.findOneAndUpdate(req.params.leaderId, {$set: req.body}, {new :true }).then((leader)=>{
            if(leader != null)
            {
                 res.statusCode = 200;
                 res.setHeader('content-type', 'application/json');
                 res.json(leader)
            }
            else{
                 res.statusCode = 403;
                 res.end('Cannot find leader');
            }
        },(err) => next(err)).catch((err) => next(err))
    })
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        leaders.findByIdAndRemove(req.params.leaderId).then((resp)=>{
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json(resp)
        },(err) => next(err)).catch((err) => next(err))
    })

module.exports = leaderRouter;