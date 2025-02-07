const express = require('express');
//set config template 
const path = require('path')
const configView = (app) => {
    app.set('views', path.join('./src', 'views'))
    app.set('view engine', 'ejs')
    //set static file
    app.use(express.static(path.join('./src', 'public')))
}
module.exports = configView;