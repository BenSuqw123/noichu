const express = require('express')
const { getHomePage, getNoiChuPage, getNoiChuOnlPage, createrooms, getRoomPage } = require('../controler/homeController')
const router = express.Router()

router.get('/', getHomePage)
router.get('/noiChu', getNoiChuPage)
router.get('/noiChuOnl', getNoiChuOnlPage)
router.get('/noiChuOnl/:id', getRoomPage)
router.post('/createroom', createrooms)
module.exports = router;