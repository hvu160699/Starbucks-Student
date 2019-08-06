const mongoose = require('mongoose')

const product = new mongoose.Schema({
    name: String,
    price: String
})

const billSchema = new mongoose.Schema({
    publishDate: {
        type: String,
    },
    totalPrice: {
        type: String,
        required: true,
    },
    // cart: {
    //     type: Object,
    //     require: true,
    //     products: [
    //         {
    //             name: { type: String },
    //             price: { type: String }
    //         }
    //     ]
    // }
    cart: [
        product
    ]

})


module.exports = mongoose.model('Bill', billSchema)