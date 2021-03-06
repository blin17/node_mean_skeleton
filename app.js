var express = require('express')
  , cons = require('consolidate')
  , validate = require('express-validator')
  , http = require('http')
  , path = require('path')
  , nport = 3000;

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'app');

var App = function(){
  var self = this;

  self.initializeServer = function(){
    require('./src/server/routes')(self.app,self.io);
  };

  self.initialize = function(){
    // all environments

    self.app = express();
    //self.app.set('port', process.env.PORT || 3000);
    
    self.app.set('views', __dirname + '/src/views');
    self.app.set('view engine', 'html');
    self.app.engine('html', cons.ejs);
    self.app.use(express.favicon());
    self.app.use(express.logger('dev'));
    self.app.use(express.bodyParser());
    self.app.use(express.methodOverride());
    self.app.use(self.app.router);
    self.app.use(validate());
    self.app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == self.app.get('env')) {
      self.app.use(express.errorHandler());
    }
  }

  self.start = function(){
    self.server = self.app.listen(nport, function(){
       console.log("Express started on port"+ nport);
    });
    self.io = require('socket.io').listen(self.server);
    self.initializeServer();
  }
};
 
var app = new App();
app.initialize();
app.start();
