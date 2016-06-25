var express = require('express');
var githubRequestHandler = require('./githubRequestHandler');

var app = express();

// Retrieve port assigned by Heroku
var port = process.env.PORT || 8080;

app.get('/topRepo/:userHandle', (req, res) => {
    githubRequestHandler
        .getTopRepositories(req.params.userHandle)
        .then(
            result => res.json(result),
            result => res.status(404).json(result)
        );
});

app.listen(port, function () {
  console.log('ghapi listening on port:', port);
});