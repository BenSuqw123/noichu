const express = require('express')
const { getHomePage, getNoiChuPage, getXinLoiPage } = require('../controler/homeController')
const router = express.Router()

router.get('/', getHomePage)
router.get('/noiChu', getNoiChuPage)
router.get('/xinloipage', getXinLoiPage)
module.exports = router;