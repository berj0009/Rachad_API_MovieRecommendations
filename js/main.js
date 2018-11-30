let rachadMovieRecommendations = (function(){
	/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];
let searchString = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
	document.querySelector(".optionDiv").addEventListener("click", showOverlay);
	document.querySelector(".cancelButton").addEventListener("click", hideOverlay);
	document.querySelector(".overlay").addEventListener("click", hideOverlay);
	document.querySelector(".saveButton").addEventListener("click", function (e) {
		let optionList = document.getElementsByName("option");
		let optionType = null;
		for (let i = 0; i < optionList.length; i++) {
			if (optionList[i].checked) {
				optionType = optionList[i].value;
				break;
			}
		}


		hideOverlay(e);

	});


	//    console.log(APIKEY);
	addEventListener();
	getLocalStorageData();



}

function addEventListener() {
	let searchButton = document.querySelector(".search-div");
	searchButton.addEventListener("click", startSearch);
	let backHome = document.getElementById("#back-button");
	//    backButton.addEventListener("click", back);

	//    let saveButton = document.getElementById("saveButton");
	// saveButton.addEventListener("click", saveLocalStorageData);
	//    
	//    let clearButton = document.getElementById("clearAllButton");
	// clearButton.addEventListener("click", function(){
	//        localStorage.clear();
	//   
	//    

}




function showOverlay(e) {
	e.preventDefault();
	let overlay = document.querySelector(".overlay");
	overlay.classList.remove("hide");
	overlay.classList.add("show");
	showModal(e);
}

function showModal(e) {
	e.preventDefault();
	let modal = document.querySelector(".modal");
	modal.classList.remove("off");
	modal.classList.add("on");
}

function hideOverlay(e) {
	e.preventDefault();
	e.stopPropagation(); // don't allow clicks to pass through
	let overlay = document.querySelector(".overlay");
	overlay.classList.remove("show");
	overlay.classList.add("hide");
	hideModal(e);
}

function hideModal(e) {
	e.preventDefault();
	let modal = document.querySelector(".modal");
	modal.classList.remove("on");
	modal.classList.add("off");
}

function getLocalStorageData() {
	//load image sizes and base url from local storage

	//doesn't exist
	//the data is  there but stale (over 1 hour old)
	//if there is no poster path or sizes in local storage or if the information is over 60 minutes old (stale)
	//then we need to get that data from TMDb using fetch
	getPosterPathAndSizes();
}
//else it does exist and is less than 1 hour old
//load from local storage


localStorage.getItem



function getPosterPathAndSizes() {
	let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`;

	fetch(url)
		.then(function (response) {
			return response.json();

		})
		.then(function (data) {
			console.log(data);
			imageURL = data.images.secure_base_url;
			imageSizes = data.images.poster_sizes;
			console.log(imageURL);
			console.log(imageSizes);

		})
		.catch(function (error) {
			alert(error);
		});
}

function startSearch() {
	console.log("start search");
	searchString = document.getElementById("search-input").value;
	if (!searchString) {
		alert("Please enter search data");
		searchString.focus();
		return;
	}
	// this is a new search so you should reset any existing page data

	getSearchResults();

}

function getSearchResults() {

	// https://developers.themoviedb.org/3/search/search-movies  look up search movie (also TV Shows)
	let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data);

			//  create the page from data
			createPage(data);

			//  navigate to "results";
		})
		.catch(error => console.log(error));
}

function createPage(data) {
	let content = document.querySelector("#search-results>.content");
	let title = document.querySelector("#search-results>.title");
	let message = document.createElement("h2");
	content.innerHTML = "";
	title.innerHTML = "";

	if (data.total_results == 0) {
		message.innerHTML = `No results found for ${searchString}`;
	} else {
		message.innerHTML = `Total results = ${data.total_results} for ${searchString}`;


	}
	title.appendChild(message);

	let documentFragment = new DocumentFragment();


	documentFragment.appendChild(createMovieCards(data.results));

	content.appendChild(documentFragment);

	let cardList = document.querySelectorAll(".content>div");

	cardList.forEach(function (item) {
		item.addEventListener("click", getRecommendations);

	});
}



function goBack() {
	let mainPage = document.querySelector("#main-page");
	let searchResults = document.querySelector("#search-results");
	let recommendResults = document.querySelector("#recommend-results");
	let backButtonDiv = document.querySelector("#back-button")

	if (searchResults.className != "page") {
		searchResults.classList.add("page");
		mainPage.classList.remove("page");
	} else if (recommendResults.className != "page") {
		recommendResults.classList.add("page");
		searchResults.classList.remove("page");
	}
	if (document.querySelector("#main-page").classList.value != "page") {
		console.log("worked");
		document.querySelector("#back-button").classList.add("hide");
	} else {
		document.querySelector("#back-button").classList.remove("hide");
	}
}

function createMovieCards(results) {

	let documentFragment = new DocumentFragment(); // use a documentFragment for performance

	results.forEach(function (movie) {

		let movieCard = document.createElement("div");
		let section = document.createElement("section");
		let image = document.createElement("img");
		let videoTitle = document.createElement("p");
		let videoDate = document.createElement("p");
		let videoRating = document.createElement("p");
		let videoOverview = document.createElement("p");

		// set up the content
		videoTitle.textContent = movie.title;
		videoDate.textContent = movie.release_date;
		videoRating.textContent = movie.vote_average;
		videoOverview.textContent = movie.overview;

		// set up image source URL
		image.src = `${imageURL}${imageSizes[2]}${movie.poster_path}`;

		// set up movie data attributes
		movieCard.setAttribute("data-title", movie.title);
		movieCard.setAttribute("data-id", movie.id);

		// set up class names
		movieCard.className = "movieCard";
		section.className = "imageSection";

		// append elements
		section.appendChild(image);
		movieCard.appendChild(section);
		movieCard.appendChild(videoTitle);
		movieCard.appendChild(videoDate);
		movieCard.appendChild(videoRating);
		movieCard.appendChild(videoOverview);

		documentFragment.appendChild(movieCard);

	});

	return documentFragment;
}

function createTVCards(results) {

	let documentFragment = new DocumentFragment(); // use a documentFragment for performance

	results.forEach(function (tv) {

		let movieCard = document.createElement("div");
		let section = document.createElement("section");
		let image = document.createElement("img");
		let videoTitle = document.createElement("p");
		let videoDate = document.createElement("p");
		let videoRating = document.createElement("p");
		let videoOverview = document.createElement("p");

		// set up the content
		videoTitle.textContent = movie.title;
		videoDate.textContent = movie.release_date;
		videoRating.textContent = movie.vote_average;
		videoOverview.textContent = movie.overview;

		// set up image source URL
		image.src = `${imageURL}${imageSizes[2]}${tv.poster_path}`;

		// set up movie data attributes
		movieCard.setAttribute("data-title", movie.title);
		movieCard.setAttribute("data-id", movie.id);

		// set up class names
		movieCard.className = "movieCard";
		section.className = "imageSection";

		// append elements
		section.appendChild(image);
		movieCard.appendChild(section);
		movieCard.appendChild(videoTitle);
		movieCard.appendChild(videoDate);
		movieCard.appendChild(videoRating);
		movieCard.appendChild(videoOverview);

		documentFragment.appendChild(movieCard);

	});

	return documentFragment;
}





function getRecommendations() {
	//    console.log(this);
	let movieTitle = this.getAttribute("data-title");
	//    searchString = movieTitle;

	let movieID = this.getAttribute("data-id");
	console.log("you clicked: " + movieTitle + " " + movieID);

	let url = `${movieDataBaseURL}movie/${movieID}/recommendations?api_key=${APIKEY}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data);

			//  create the page from data
			createPage(data);

			//  navigate to "results";
		})
		.catch(error => console.log(error));
}
})();