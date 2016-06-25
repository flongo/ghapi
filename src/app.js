var http = require('http');
var express = require('express');
var githubRequestHandler = require('./githubRequestHandler');

var app = express();

app.set('port', (process.env.PORT || 8080));

app.get('/topRepo/:userHandle', (req, res) => {
    githubRequestHandler
        .getTopRepositories(req.params.userHandle)
        .then(
            result => res.json(result),
            result => res.status(404).json(result)
        );
});

http.createServer(app).listen(app.get('port'));