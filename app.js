var express = require('express');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var privateKey = fs.readFileSync(path.join(__dirname, './ssl/server.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './ssl/server.crt'), 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

app.set('view engine','ejs');
app.set('views', __dirname + '/views');

app.get('/test', function (req, res, next) {
  res.render('index');
  next();
});
app.use(express.static(path.join(__dirname, '../assets.kf5'), {

    setHeaders: function(res, path, stat) {
        // 字体文件跨域
        if(res && /\.(eot|svg|ttf|woff)$/.test(path)) {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    }
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(404);
  var err = new Error('Not Found');
  err.status = 404;
  res.status(err.status);
  next();
});



var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(5000, function(req, res){
  console.log('HTTP Static files server start [ OK ]');
});

httpsServer.listen(443, function(){
  console.log('HTTPS Static files server start [ OK ]');
});


module.exports = app;
