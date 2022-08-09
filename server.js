var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var auth = require('./routes/auth');
var update = require('./routes/update');
var profile = require('./routes/profile');
var cors = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((err, req, res, next) => {res.status(500).send('Something broke!');});
  

var port = process.env.PORT || 8000;        // set our port

app.use('/auth',auth);
app.use('/update',update);
app.use('/profile',profile)
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API listening on port ' + port);