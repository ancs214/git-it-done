
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


//REQUEST DATA FROM SERVER
var getUserRepos = function (user) {
    //format github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    //then() method returns a promise
    //after fetching, response was formatted to JSON with json() method
    //function(data) is a callback function that captures tha actual data
    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            //send data to displayRepos function
            displayRepos(data, user);
        })
    });
};


//ON FORM SUBMISSION, RUN GETUSERREPOS FUNCTION
var formSubmitHandler = function (event) {
    event.preventDefault();

    //get value from input element
    var username = nameInputEl.value.trim();

    //form validation
    if (username) {
        getUserRepos(username);
        //clear the form after searching for repo data
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.");
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);



var displayRepos = function (repos, searchTerm) {
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    // console.log(repos);
    // console.log(searchTerm);

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name to show "login name/repo name" 
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

};