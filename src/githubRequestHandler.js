var request = require('request');
var util = require('util');


const DEFAULT_DOMAIN = 'https://api.github.com';
const URL_FORMAT = '%s/users/%s/repos';
const SERVICE_UNAVAILABLE_ERROR_MESSAGE = 'The service is currently unavailable';
const USER_NOT_FOUND_ERROR_MESSAGE_FORMAT = 'User %s was not found';
const REPO_COUNT = 5;
const REPO_PROPERTIES = ['id', 'name', 'size', 'html_url'];

/**
 * Compute the 5 biggest GitHub repositories owned by a user. If the user has less than 5 repositories they are all returned
 * The domain is variable in order to make the method testable using a ghost server
 * @param {String} user - mandatory - GitHub user handle
 * @param {String} domain - defaults to DEFAULT_DOMAIN - domain to target for the /user/repos API
 * @return {Promise} fulfilled with the list of repositories or rejected with an error message
 * @public
 */
var getTopRepositories = (user, domain) => {
    return new Promise((resolve, reject) => {
        request(createRequestObject(user, domain), (error, response) => {
            if (!error && response.statusCode == 200) {
                resolve(formatResponse(response.body));
            } else {
                var message = error ? SERVICE_UNAVAILABLE_ERROR_MESSAGE : util.format(USER_NOT_FOUND_ERROR_MESSAGE_FORMAT, user);
                reject({
                    message
                });
            }            
        });
    });
};

/**
 * Return a correct request object
 * @param {String} user - mandatory - GitHub user handle
 * @param {String} domain - defaults to DEFAULT_DOMAIN - domain to target for the /user/repos API
 * @return {Object} request object to provide to the request module
 * @private
 */
var createRequestObject = (user, domain) => {
    return {
        url : util.format(URL_FORMAT, domain || DEFAULT_DOMAIN, user),
        headers : {
            'User-Agent': 'ghapi'
        },
        json : true
    }
};


/**
 * Return the list of repository properly sorted, spliced and polished
 * @param {Object} body - body of the GitHub response
 * @return {Object} formatted body
 * @private
 */
var formatResponse = body => {    
    body.sort((first, second) => parseFloat(second.size) - parseFloat(first.size));
    if (body.length > REPO_COUNT) {
        body.splice(REPO_COUNT, body.length - REPO_COUNT);
    }
    return body.map(entry => formatRepo(entry));
};

/**
 * Return a repository description object that contains only a subset of the original properties.
 * The returned keys are contained in array REPO_PROPERTIES
 * @param {Object} repo - repo as returned by GitHub API
 * @return {Object} formatted repository description object
 * @private
 */
var formatRepo = repo => {
    var simplifiedRepo = {};
    REPO_PROPERTIES.forEach(prop => {
        simplifiedRepo[prop] = repo[prop];
    });
    return simplifiedRepo;
};



module.exports = {
    getTopRepositories
};