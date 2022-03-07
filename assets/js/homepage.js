var getUserRepos = function (user) {
    //format github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    //make a request to the url
    fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
        console.log(data);
    })
});
};
getUserRepos("facebook");



//then() method returns a promise
//after fetching, response was formatted to JSON with json() method
//function(data) is a callback function that captures tha actual data