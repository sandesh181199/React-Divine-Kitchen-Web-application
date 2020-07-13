const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;



const DishSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true
    },
    category : {
        type: String,
        required: true
    },
    label : {
        type: String,
        default : ''
    },
    description : {
        type: String, 
        required: true,
        unique: true
    },
    price : {
        type : Currency
    },
    featured: {
         type: String,
         default: true
     },
},
    {
        timestamps: true
    }
)
const Dishes = mongoose.model('Dish',DishSchema);
module.exports = Dishes;