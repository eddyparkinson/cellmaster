// Generated by LiveScript 1.5.0
/*
CC0 1.0 Universal

To the extent possible under law, å”�é³³ has waived all copyright and
related or neighboring rights to EtherCalc.

This work is published from Taiwan.

<http://creativecommons.org/publicdomain/zero/1.0>
*/
(function(){
  var http2, fs, slurp, argv, json, port, host, basepath, keyfile, certfile, key, polling, cors, expire, transport, options, zap, replace$ = ''.replace;
  http2 = require('spdy');
  fs = require('fs');
  slurp = function(it){
    return require('fs').readFileSync(it, 'utf8');
  };
  argv = (function(){
    try {
      return require('optimist').boolean(['vm', 'polling', 'cors']).argv;
    } catch (e$) {}
  }()) || {};
  json = (function(){
    try {
      return JSON.parse(slurp('/home/dotcloud/environment.json'));
    } catch (e$) {}
  }());
  port = Number(argv.port || (json != null ? json.PORT_NODEJS : void 8) || process.env.PORT || process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT) || 8000;
  host = argv.host || process.env.VCAP_APP_HOST || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
  basepath = replace$.call(argv.basepath || "", /\/$/, '');
  keyfile = argv.keyfile, certfile = argv.certfile, key = argv.key, polling = argv.polling, cors = argv.cors, expire = argv.expire;
  transport = 'http';
  if (keyfile != null && certfile != null) {
    options = {
      https: {
        key: slurp(keyfile),
        cert: slurp(certfile)
      }
    };
    transport = 'https';
  } else {
    options = {};
  }
  console.log("Please connect to: " + transport + "://" + (host === '0.0.0.0' ? require('os').hostname() : host) + ":" + port + "/");
  if (cors) {
    options.io = {
      origin: '*'
    };
  }
  zap = require('zappajs').app(options, function(){
    this.KEY = key;
    this.BASEPATH = basepath;
    this.POLLING = polling;
    this.CORS = cors;
    this.EXPIRE = +expire;
    if (isNaN(this.EXPIRE)) {
      this.EXPIRE = 0;
    }
    return this.include('main');
  });
  options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
  };
  http2.createServer(options, zap.app).listen(port, host);
}).call(this);
