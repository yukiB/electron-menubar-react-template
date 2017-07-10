"use strict";
const menubar = require('menubar')

const mb = menubar({width:300, height:200, preloadWindow:true})

mb.on('ready', function ready () {
    console.log('app is ready!!');
})
