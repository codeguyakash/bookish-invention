// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import * as compression from 'compression'
import * as express from 'express';
import { join } from 'path';

//define null event
global['Event'] = null;
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();
const compression = require('compression');

// var https = require('https');
var fs = require('fs');
var express = require('express');
// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');
// var forceSsl = require('express-force-ssl');
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.use(compression());

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));
// app.use(forceSsl);
// var options = {
//   key: fs.readFileSync('/etc/ssl/luminous/star.solarbyluminous.com.key'),
//   cert: fs.readFileSync('/etc/ssl/luminous/star.solarbyluminous.com.crt')
// };

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

app.get('/*', function (req, res, next) {
  if (req.headers.host.match(/^www/) !== null) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
})

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

// https.createServer(options, app).listen(443);
