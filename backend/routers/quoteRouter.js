const express = require('express')
const fetchQuote = require('../lib/quoteService')
const quoteRouter = express.Router()

quoteRouter
    .get('/getQuote', fetchQuote)

module.exports = quoteRouter