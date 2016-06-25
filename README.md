# GHAPI

Ghapi exposes an HTTP API that, given a user's GitHub handle, retrieves the top five public repositories owned by that user, ordered by size.

## API

```
topReco/[user]
```
where `user` is a GitHub user.

If the user exists, the API returns
```
statusCode : 200
body : [Array of repositories]
```

The array of repositories contains the 5 biggest repositories owned by the user. If the user has less than 5 repositories, they are all returned. In any case, repositories are sorted in descending order of `size`.

Each repository will only contain a subset of the properties returned by the GitHub API. 

If the user does not exist, the API returns
```
statusCode : 404
body : {"message":"User %user% was not found"}
```

If GitHub is down, the API returns
```
statusCode : 404
body : {"message":"The service is currently unavailable"}
```


## Public url

Ghapi is deployed on `https://ghapitest.herokuapp.com`. You can test it using
```
https://ghapitest.herokuapp.com/topRepo/[user]
```

## Start it locally

```
npm install
npm start
```

You can then target `http://localhost:8080/topRepo/[user]`.

## Run test campaign

```
npm install
npm test
```
