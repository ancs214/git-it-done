var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
//span element for repo name
var repoNameEl = document.querySelector("#repo-name");


//GET REPO NAME 
var getRepoName = function () {
    //console.log document.location to see properties..."search" was the property that contained our query parameter 
    //grab repo name from url query string
    var queryString = document.location.search;
    //using string method split() to obtain just the repo name from our querystring
    //split ?repo=ancs214/ANCS at the "=" to make two arrays, then accessed our second array at index 1 to get "ancs214/ANCS"
    var repoName = queryString.split("=")[1];

    if (repoName) {
    //update header span element text to display repo name
    repoNameEl.textContent = repoName;
    //run getRepoIssues function with the query string as a parameter
    getRepoIssues(repoName);
    } else {
        //if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
}



//GET REPOSITORY ISSUES FUNCTION
var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl)
        .then(function (response) {
            // if request successful, format to json
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    //pass response data to dom function
                    displayIssues(data);
                    //check if api has paginated issues
                    if (response.headers.get("Link")) {
                        displayWarning(repo);
                    }
                });
            } else {
                alert("There was a problem with your request!");
                console.log(response);
                //if not successful, redirect to homepage
                // document.location.replace("./index.html");
            }
        });
}


//DISPLAY REPOSITORY ISSUES FUNCTION
var displayIssues = function (issues) {
    //if there are no issues, let the user know
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    //loop over the response data
    for (var i = 0; i < issues.length; i++) {
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        //add class for styling
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        //issues have an html_url property that links to the full issue on github
        issueEl.setAttribute("href", issues[i].html_url);
        //open on new page
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        //set text content from issue object
        titleEl.textContent = issues[i].title;
        //append titleEl to container issueEl
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");
        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container issueEl
        issueEl.appendChild(typeEl);

        //after all this...we STILL need to append the elements to the actual page somewhere!! 
        //append issueEl to issueContainerEl defined at top of js file
        issueContainerEl.appendChild(issueEl);
    }
};

//TIP: to find which properties each issue object has you can console.log the response data, look at the preview panel in Network tab in chrome dev tools, or load the requested url in the browser


//FUNCTION TO LET USER KNOW THERE ARE MORE THAN 30 ISSUES
var displayWarning = function (repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    //create link element
    var linkEl = document.createElement("a");
    //insert text content for link element
    linkEl.textContent = "See More Issues on GitHub.com";
    //set link to repo issues website page in a new tab
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};




getRepoName();