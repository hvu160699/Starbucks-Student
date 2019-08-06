const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    publishDate: {
        type: String,
    },
    totalPrice: {
        type: String,
        required: true,
    },
    cart: {
        type: Object,
        require: true,
        products: [
            { name: { type: String }, price: { type: String } }
        ]
    }
})


module.exports = mongoose.model('Bill', billSchema)