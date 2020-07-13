const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const promotions = require('../models/promotions');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    promotions.find(req.query)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(promotion)
    }, (err) => next(err)).catch((err) => next(err));
}).
post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
     promotions.create(req.body).then((promotion) => {
         console.log('promotion created');
         res.statusCode = 200;
         res.setHeader('content-type', 'application/json');
         res.json(promotion)
     }, (err) => next(err)).catch((err) => next(err));
}).
put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported operation here ')
}).
delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.remove({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json(resp)
    }, (err) => next(err)).catch((err) => next(err));
})

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
        promotions.findById(req.params.promoId).then((promition) => {
            if (promition != null) {
                res.statusCode = 200;
                res.setHeader('content-type', 'application/json');
                res.json(promition)
            } else {
                res.statusCode = 403;
                res.end('Cannot find promotion');
            }
        }, (err) => next(err)).catch((err) => next(err))
    })
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST is not supported operation here')
    })
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
       promotions.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {new: true}).then((promotion) => {
           if (promotion != null) {
               res.statusCode = 200;
               res.setHeader('content-type', 'application/json');
               res.json(promotion)
           } else {
               res.statusCode = 403;
               res.end('Cannot find promotion');
           }
       }, (err) => next(err)).catch((err) => next(err))
    })
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
       promotions.findByIdAndRemove(req.params.promoId).then((resp)=>{
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json(resp)
       },(err) => next(err)).catch((err) => next(err))
    })

module.exports = promoRouter;