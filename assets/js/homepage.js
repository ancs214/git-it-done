
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector('#language-buttons');


//REQUEST DATA FROM SERVER
var getUserRepos = function (user) {
    //format github api url: fetch function will retrieve SPECIFIC user's repos
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    //then() method returns a promise
    //after fetching, response was formatted to JSON with json() method
    //function(data) is a callback function that captures tha actual data
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert('Error: GitHub User Not Found');
            }
        })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
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



//function to obtain list of repos
var displayRepos = function (repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

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
        var repoEl = document.createElement("a");
        //set styling
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //set href attribute to link to the single-repo html page
        //notice the href is a relative path from the index page, not the js file
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

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

//function to get featured repos
var getFeaturedRepos = function (language) {
    //accepts a language parameter, creates an API endpoint
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    //make request to that API endpoint 
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //run function to get list of repos and pass in data.items, language as argument
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

//TIP: we can test getFeaturedRepos by entering getFeaturedRepos("javascript") in the console, then navigate to Network tab and Preview to view the response


var buttonClickHandler = function(event) {
    //browser's event object will have a target property that tells us exactly which html element was interacted with to create the event
    var language = event.target.getAttribute("data-language");
    //if a language was clicked, call getFeaturedRepos passing the variable language as parameter
    if (language) {
        getFeaturedRepos(language);
        //clear old content
        repoContainerEl.textContent = "";
    }
}

languageButtonsEl.addEventListener("click", buttonClickHandler);