const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },
    dish : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Dish'
    }
}, {
    timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;