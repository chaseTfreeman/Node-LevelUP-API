var express = require('express')
, http = require('http')
, methodOverride = require('method-override')
, bodyParser = require('body-parser')
, errorHandler = require('error-handler')
var levelup = require('levelup');
var app = express();
var url = require('url');


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname, 'views');
app.set('view engine', 'jade');
app.use(methodOverride());
app.use(bodyParser.json());

if ('development' == app.get('env')) {
app.use(errorHandler);
}

var db = levelup('./contact', {valueEncoding: 'json'});
db.put('+359777123456', {
  "firstname": "Joe",
  "lastname": "Smith",
  "title": "Mr.",
  "company": "Dev inc",
  "jobtitle": "developer",
  "primarycontactnumber": "+35977123456",
  "othercontactnumbers": [
    "+359777456789",
    "+359777112233"],
  "primaryemailaddress":"joe.smith@xyz.com",
  "groups": ["dev", "family"]
  });

  app.get('/contacts/:number', function(req, res){
    console.log(req.url +' : querying for ' + req.params.number);
    db.get(req.params.number,
    function(error, data){
      if (error){
        res.writeHead(404, {
          'Content-Type': 'text/plain'});
          res.end('Not Found');
          return;
        }
          res.setHeader('content-type', 'application/json');
            res.send(data);
        })
    })
  console.log('Running @ Port' + app.get('port'));
  http.createServer(app).listen(app.get('port'))

module.exports = app;
