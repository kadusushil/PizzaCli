/**
 * This file provide following things.
 * - Entry into application
 * - Initilizes the app
 **/

const server = require('./lib/server');
const cli = require('./lib/cli');
const _data = require('./lib/data');

var app = {};

app.init = () => {

  _data.init();

  server.init();

  // init the CLI such that it starts very last.
  setTimeout(() => {
    cli.init()}, 50);
}

app.init();

module.exports = app;
