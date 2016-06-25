var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.get('/users/:userHandle/repos', (req, res) => {
    setTimeout(() => {
        var mockRes = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', req.params.userHandle + 'Mock.json'), 'utf8'));
        res.status(mockRes.statusCode).json(mockRes.body);
    }, 10);
});

// Mock server
var server = http.createServer(app);

var start = () => {
    return new Promise(resolve => {
        server.listen(3000, resolve);
    });
};

var stop = () => {
    return new Promise(resolve => {
        server.close(resolve);
    });
};

module.exports = {
    start,
    stop,
    url : 'http://localhost:3000'
};