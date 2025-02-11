const express = require('express')
const connection = require('../config/database')
const { getAllUsers } = require('../service/CRUDService')

const getHomePage = async (req, res) => {
    await res.render('home.ejs')
}
const getNoiChuPage = async (req, res) => {
    await res.render('noiChu.ejs')
}
const getNoiChuOnlPage = async (req, res) => {
    const results = await getAllUsers();
    await res.render('noiChuOnl.ejs', { listUsers: results })
}
const createrooms = async (req, res) => {
    let name = req.body.roomName;
    let players = req.body.players;
    console.log(name, players)
    let [results, fields] = await connection.query(`INSERT INTO Users (name, players, currentPlayers) VALUE(?, ?, ?)`, [name, players, 1])
    let userId = results.insertId;
    console.log("User ID:", userId);
    res.redirect(`/noiChuOnl/${userId}`);
}
const getRoomPage = async (req, res) => {
    res.render('room')

}

module.exports = { getHomePage, getNoiChuPage, getNoiChuOnlPage, createrooms, getRoomPage }