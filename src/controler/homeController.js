const express = require('express')


const getHomePage = async (req, res) => {
    await res.render('home.ejs')
}
const getNoiChuPage = async (req, res) => {
    await res.render('noiChu.ejs')
}
const getNoiChuOnlPage = async (req, res) => {
    await res.render('noiChuOnl.ejs')
}

module.exports = { getHomePage, getNoiChuPage, getNoiChuOnlPage }