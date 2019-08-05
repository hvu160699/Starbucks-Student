const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Category = require('../models/category')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// List Product JSON
router.get('/listAllProduct', (req, res) => {
  Product.find().then(data => res.json(data)).catch(err => console.log(err))
})

router.get('/listAllProduct/:id', async (req, res) => {
  Product.find().populate('category').then(data => res.json(data))
})

// All Products Route
router.get('/', async (req, res) => {
  let query = Product.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const products = await query.exec()
    res.render('products/index', {
      products: products,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Product Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Product())
})

// Create Product Route
router.post('/', async (req, res) => {
  const product = new Product({
    title: req.body.title,
    category: req.body.category,
    publishDate: new Date(req.body.publishDate),
    price: req.body.price,
    coverImage: req.body.coverImage,
    description: req.body.description
  })
  saveCover(product, req.body.cover)

  try {
    const newProduct = await product.save()
    res.redirect(`products/${newProduct.id}`)
  } catch {
    renderNewPage(res, product, true)
  }
})

// Show Product Route
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .exec()
    res.render('products/show', { product: product })
  } catch {
    res.redirect('/')
  }
})

// Edit Product Route
router.get('/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    renderEditPage(res, product)
  } catch {
    res.redirect('/')
  }
})

// Update Product Route
router.put('/:id', async (req, res) => {
  let product

  try {
    product = await Product.findById(req.params.id)
    product.title = req.body.title
    product.category = req.body.category
    product.publishDate = new Date(req.body.publishDate)
    product.price = req.body.price
    product.coverImage = req.body.coverImage
    product.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(product, req.body.cover)
    }
    await product.save()
    res.redirect(`/products/${product.id}`)
  } catch {
    if (product != null) {
      renderEditPage(res, product, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Product Page
router.delete('/:id', async (req, res) => {
  let product
  try {
    product = await Product.findById(req.params.id)
    await product.remove()
    res.redirect('/products')
  } catch {
    if (product != null) {
      res.render('products/show', {
        product: product,
        errorMessage: 'Could not remove product'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, product, hasError = false) {
  renderFormPage(res, product, 'new', hasError)
}

async function renderEditPage(res, product, hasError = false) {
  renderFormPage(res, product, 'edit', hasError)
}

async function renderFormPage(res, product, form, hasError = false) {
  try {
    const categories = await Category.find({})
    const params = {
      categories: categories,
      product: product
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Product'
      } else {
        params.errorMessage = 'Error Creating Product'
      }
    }
    res.render(`products/${form}`, params)
  } catch {
    res.redirect('/products')
  }
}

function saveCover(product, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImage = new Buffer.from(cover.data, 'base64')
    product.coverImageType = cover.type
  }
}

module.exports = router
