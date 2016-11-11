// Generated by LiveScript 1.5.0
/*
CC0 1.0 Universal

To the extent possible under law, å”�é³³ has waived all copyright and
related or neighboring rights to EtherCalc.

This work is published from Taiwan.

<http://creativecommons.org/publicdomain/zero/1.0>
*/
(function(){
  var fs, http2, slurp, argv, json, port, host, basepath, keyfile, certfile, key, polling, cors, expire, options, transport, replace$ = ''.replace;
  fs = require('fs');
  http2 = require('spdy');
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
  options = {
    host: host,
    port: port,
    ready: function(){
      return console.log("Please connect to: " + transport + "://" + (host === '0.0.0.0' ? require('os').hostname() : host) + ":" + port + "/");
    }
  };
  transport = 'http';
  if (keyfile != null && certfile != null) {
    options.https = {
      key: fs.readFileSync(keyfile),
      cert: fs.readFileSync(certfile)
    };
    options.http_module = http2;
    transport = 'https';
  }
  if (cors) {
    options.io = {
      origin: '*'
    };
  }
  require('zappajs')(options, function(){
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
}).call(this);
