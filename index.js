/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-heroku-oauth',

  serverMiddleware: function(config) {
    var app = config.app;

    var dotenv = require('dotenv');
    dotenv.load();

    var session = require('client-sessions')({
      cookieName: 'session',
      secret: process.env.SESSION_SECRET,
      duration: 24 * 60 * 60 * 1000,
      activeDuration: 1000 * 60 * 5,
      cookie: {
        path     : '/',
        ephemeral: false,
        httpOnly : true,
        secureProxy: process.env.NODE_ENV === 'production'
      }
    });

    var bouncer = require('heroku-bouncer')({
      oAuthClientID      : process.env.HEROKU_OAUTH_ID,
      oAuthClientSecret  : process.env.HEROKU_OAUTH_SECRET,
      encryptionSecret   : process.env.HEROKU_BOUNCER_SECRET,
      oAuthScope         : 'global'
    });

    app.use(session);
    app.use(bouncer.middleware);
    app.use(bouncer.router);
  }
};
