var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl)
    .then(function(response) {
        // if request successful, format to json
        if (response.ok) {
          response.json().then(function(data) {
            // console.log(data);
            //pass response data to dom function
            displayIssues(data);
          });
        }
        else {
          alert("There was a problem with your request!");
        }
      });
}

getRepoIssues("ancs214/Ashportfolio");


var displayIssues = function(issues) {
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