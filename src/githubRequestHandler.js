var request = require('request');
var util = require('util');

const DEFAULT_DOMAIN = 'https://api.github.com';
const URL_FORMAT = '%s/users/%s/repos';
const SERVICE_UNAVAILABLE = 'The service is currently unavailable';
const USER_NOT_FOUND_FORMAT = 'User %s was not found';
const REPO_COUNT = 5;
const REPO_PROPERTIES = ['id', 'name', 'size', 'html_url'];

var getTopRepositories = (user, domain) => {
    return new Promise((resolve, reject) => {
        request(createRequestObject(user, domain), (error, response) => {
            if (!error && response.statusCode == 200) {
                resolve(formatResponse(response.body));
            } else {
                var message = error ? SERVICE_UNAVAILABLE : util.format(USER_NOT_FOUND_FORMAT, user);
                reject({
                    message
                });
            }            
        });
    });
};

var createRequestObject = (user, domain) => {
    return {
        url : util.format(URL_FORMAT, domain || DEFAULT_DOMAIN, user),
        headers : {
            'User-Agent': 'ghapi'
        },
        json : true
    }
};

var formatResponse = body => {    
    body.sort((first, second) => parseFloat(second.size) - parseFloat(first.size));
    if (body.length > REPO_COUNT) {
        body.splice(REPO_COUNT, body.length - REPO_COUNT);
    }
    return body.map(entry => formatRepo(entry));
};

var formatRepo = repo => {
    var simplifiedEntry = {};
    REPO_PROPERTIES.forEach(prop => {
        simplifiedEntry[prop] = repo[prop];
    });
    return simplifiedEntry;
};



module.exports = {
    getTopRepositories
};