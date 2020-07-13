const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const promotionSchema = new Schema({

    name : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true
    },
    label : {
        type : String,
        default : ''
    },
    price : {
        type : Currency,
        required : true,
        min: 0
    },
    description : {
        type: String,
        required: true,
        unique: true
    },
    featured : {
        type : String,
        default : true
    }
}, {
    timestamps : true
})
const promotions = mongoose.model('promotion', promotionSchema);
module.exports = promotions;