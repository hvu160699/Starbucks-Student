const express = require('express')
const router = express.Router()
const Bill = require('../models/bill')

router.post('/', async (req, res) => {
    const bill = new Bill({
        publishDate: req.body.publishDate,
        totalPrice: req.body.totalPrice,
        cart: req.body.cart
    })
    const newBill = await bill.save()
    res.json(newBill)
})

router.get('/listAllBill', (req, res) => {
    Bill.find().then(data => res.json(data)).catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
    Bill.findByIdAndDelete({ _id: req.params.id }).then(data => console.log(res.json(data))).catch(err => console.log(err))
})

module.exports = router
