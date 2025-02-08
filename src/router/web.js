const express = require('express')
const { getHomePage, getNoiChuPage, getNoiChuOnlPage } = require('../controler/homeController')
const router = express.Router()

router.get('/', getHomePage)
router.get('/noiChu', getNoiChuPage)
router.get('/noiChuOnl', getNoiChuOnlPage)
module.exports = router;