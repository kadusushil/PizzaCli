/**
 * This file provide following things.
 * - Entry into application
 * - Initilizes the app
 **/

const server = require('./lib/server');

var app = {};

app.init = () => {
  server.init();
}

app.init();

module.exports = app;
