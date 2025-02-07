const express = require('express')


const getHomePage = async (req, res) => {
    await res.render('home.ejs')
}
const getNoiChuPage = async (req, res) => {
    await res.render('noiChu.ejs')
}
const getXinLoiPage = async (req, res) => {
    await res.render('xinLoi.ejs')
}

module.exports = { getHomePage, getNoiChuPage, getXinLoiPage }