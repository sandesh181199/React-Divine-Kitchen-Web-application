// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const Favourite = require('../models/favourite');
// const authenticate = require('../authenticate');
// const cors = require('./cors');

// const favouriteRouter = express.Router();
// favouriteRouter.use(bodyParser.json());

// favouriteRouter.route('/')
// .options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); })
// .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
//     Favourite.find({}).populate('user').populate('dishes')
//     .then((favourite)=>{
//         if(favourite)
//         {
//             user_favourite = favourite.filter(fav=> fav.user._id.toString() === req.user.id.toString())[0]
//             if(!user_favourite)
//             {
//                 var err = new Error('You have no favourite dishes');
//                 err.status = 404;
//                 return next(err);
//             }
//             else{
//                 res.sendStatus = 200;
//                 res.setHeader('content-type', 'application/json');
//                 res.json(user_favourite);
//             }
//         }
//         else{
//             var err = new Error('You have no favourite dishes');
//             err.status= 404;
//             return next(err);
//         }
//     }, (err)=> next(err)).catch(err => next(err))
// })
// .post(cors.corsWithOptions, authenticate.verifyUser,
//     (req,res,next)=>{
//         Favourite.find({}).populate('user').populate('dishes')
//         .then((favourite)=>{
//             var user;
//             if(favourite)
//             {
//                 user = favourite.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
//             }
//             if(!user)
//             {
//                 user = new Favourite({user : req.user.id});
//             }
//             for(let i of req.body){
//                 if( user.dishes.find((d_id)=>{
//                     if(d_id._id)
//                     {
//                         return d_id._id.toString() === i._id.toString();
//                     }
//                 }))
//                 continue;
//                 user.dishes.push(i._id);
//             }

//             user.save().then((userfav)=>{
//                 res.sendStatus = 201;
//                 res.setHeader('content-type','application/json');
//                 res.json(userfav);
//                 console.log('favourite posted');
//             }, (err) =>  next(err)).catch(err => next(err));
//         }).catch(err => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('Put is not allowed');

// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favourite.find({}).populate('user').populate('dishes')
//     .then((favourite)=>{
//         var favRemove;
//         if(favourite)
//         {
//             favRemove = favourite.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
//         }
//         if(favRemove)
//         {
//             favRemove.remove()
//             .then((result)=>{
//                 res.statusCode = 200;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json(result);
//             },(err)=> console.log(err));
//         }
//         else{
//             var err = new Error('You do not have any favourites');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err)=> next(err)).catch(err => next(err));
// })

// favouriteRouter.route('/:dishID')
// .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
// .get(cors.cors, authenticate.verifyUser , (req, res, next) => {
//         Favourite.find({}).populate('user').populate('dishes')
//         .then((favourite)=>{
//         if(favourite)
//         {
//             const favs = favourite.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
//             const dish = favs.dishes.filter(dish => dish.id === req.params.dishId)[0];
//             if (dish) {
//                 res.statusCode = 200;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json(dish);
//             } else {
//                 var err = new Error('No dish found');
//                 err.status = 404;
//                 return next(err);
//             }
//         }
//         else{
//              var err = new Error('You do not have any favourite');
//              err.status = 404;
//              return next(err);
//         }
//         },(err => next(err))).catch(err=> next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favourite.find({})
//         .populate('user')
//         .populate('dishes')
//         .then((favourite) => {
//             var user;
//             if (favourite)
//                 user = favourite.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
//             if (!user)
//                 user = new Favourite({user: req.user.id});
//             if (!user.dishes.find((d_id) => {
//                     if (d_id._id)
//                         return d_id._id.toString() === req.params.dishId.toString();
//                 }))
//                 user.dishes.push(req.params.dishId);

//             user.save()
//                 .then((userFavs) => {
//                     res.statusCode = 201;
//                     res.setHeader("Content-Type", "application/json");
//                     res.json(userFavs);
//                     console.log("Favourites Created");
//                 }, (err) => next(err))
//                 .catch((err) => next(err));

//         })
//         .catch((err) => next(err));

// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation is not supported');
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//      Favourite.find({})
//          .populate('user')
//          .populate('dishes')
//          .then((favourites) => {
//              var user;
//              if (favourites)
//                  user = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
//              if (user) {
//                  user.dishes = user.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);
//                  user.save()
//                      .then((result) => {
//                          res.statusCode = 200;
//                          res.setHeader("Content-Type", "application/json");
//                          res.json(result);
//                      }, (err) => next(err));

//              } else {
//                  var err = new Error('You do not have any favourites');
//                  err.status = 404;
//                  return next(err);
//              }
//          }, (err) => next(err))
//          .catch((err) => next(err));

// })

// module.exports = favouriteRouter;




const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Favorites = require('../models/favourite');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
                user: req.user._id
            })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
                user: req.user._id
            })
            .then((favorite) => {
                if (favorite) {
                    for (var i = 0; i < req.body.length; i++) {
                        if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                            favorite.dishes.push(req.body[i]._id);
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                             Favorites.findById(favorite._id)
                                 .populate('user')
                                 .populate('dishes')
                                 .then((favorite) => {
                                     console.log('Favorite Created ', favorite);
                                     res.statusCode = 200;
                                     res.setHeader('Content-Type', 'application/json');
                                     res.json(favorite);
                                 })
                        }, (err) => next(err));
                } else {
                    Favorites.create({
                            "user": req.user._id,
                            "dishes": req.body
                        })
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    console.log('Favorite Created ', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({
                "user": req.user._id
            })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user : req.user._id})
        .then((favorites)=>{
            if(!favorites){
                res.statusCode = 200; 
                res.setHeader('Content-Type','application/json');
                return res.json({"exits":false, "favorites" : favorites})
            }
            else{
                if(favorites.dishes.indexOf(req.params.dishId) < 0){
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    return res.json({"exits":false, "favorites" : favorites})
                }
                else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    return res.json({"exits":true, "favorites" : null})
                }
            }

        },err=>next(err))
        .catch((err)=>next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
                user: req.user._id
            })
            .then((favorite) => {
                if (favorite) {
                    if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                        favorite.dishes.push(req.params.dishId)
                        favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    console.log('Favorite Created ', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                            }, (err) => next(err))
                    }
                } else {
                    Favorites.create({
                            "user": req.user._id,
                            "dishes": [req.params.dishId]
                        })
                        .then((favorite) => {
                             Favorites.findById(favorite._id)
                                 .populate('user')
                                 .populate('dishes')
                                 .then((favorite) => {
                                     console.log('Favorite Created ', favorite);
                                     res.statusCode = 200;
                                     res.setHeader('Content-Type', 'application/json');
                                     res.json(favorite);
                                 })
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({
                user: req.user._id
            })
            .then((favorite) => {
                if (favorite) {
                    index = favorite.dishes.indexOf(req.params.dishId);
                    if (index >= 0) {
                        favorite.dishes.splice(index, 1);
                        favorite.save()
                            .then((favorite) => {
                                 Favorites.findById(favorite._id)
                                     .populate('user')
                                     .populate('dishes')
                                     .then((favorite) => {
                                         console.log('Favorite Created ', favorite);
                                         res.statusCode = 200;
                                         res.setHeader('Content-Type', 'application/json');
                                         res.json(favorite);
                                     })
                            }, (err) => next(err));
                    } else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                } else {
                    err = new Error('Favorites not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = favoriteRouter;