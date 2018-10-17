/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var request = __webpack_require__(1).request;

	fetchMeals();

	function fetchMeals() {
	  request('/api/v1/meals').then(function (response) {
	    return response.json();
	  }).then(function (mealData) {
	    return populateDateDropDown(mealData);
	  });
	}

	function populateDateDropDown(mealData) {
	  var dropDown = document.getElementById('date-drop-down');
	  var validDates = extractValidDates(mealData);
	  validDates.forEach(function (date) {
	    var option = document.createElement('option');
	    option.innerHTML = date;
	    option.value = date;
	    dropDown.appendChild(option);
	  });
	  populateMeals(mealData, dropDown.childNodes[0].value);
	  dropDown.addEventListener("change", function () {
	    populateMeals(mealData, this.value);
	  });
	}

	function populateMeals(mealData, date) {
	  var mealList = document.getElementById('meal-list');
	  mealList.innerHTML = '';
	  mealData.forEach(function (meal) {
	    var mealContainer = document.createElement('div');
	    mealContainer.setAttribute('class', 'meal-container');
	    var mealTitle = document.createElement('div');
	    mealTitle.setAttribute('class', 'meal-title');
	    mealTitle.innerHTML = meal.name;
	    mealContainer.appendChild(mealTitle);
	    var paragraph = document.createElement('p');
	    paragraph.setAttribute('class', 'rows first-row');
	    var leftDiv = document.createElement('div');
	    leftDiv.setAttribute('class', 'food-name');
	    leftDiv.innerHTML = "Food";
	    var rightDiv = document.createElement('div');
	    rightDiv.setAttribute('class', 'food-calories');
	    rightDiv.innerHTML = "Calories";
	    paragraph.appendChild(leftDiv);
	    paragraph.appendChild(rightDiv);
	    mealContainer.appendChild(paragraph);

	    var totalCalories = 0;
	    meal.foods.forEach(function (food) {
	      if (reformatDateString(food.added) == date) {
	        totalCalories += food.calories;
	        var _paragraph = document.createElement('p');
	        var _leftDiv = document.createElement('div');
	        _leftDiv.setAttribute('class', 'food-name');
	        _leftDiv.innerHTML = food.name;
	        var _rightDiv = document.createElement('div');
	        _rightDiv.setAttribute('class', 'food-calories');
	        _rightDiv.innerHTML = food.calories.toString();
	        _paragraph.setAttribute('class', 'rows');
	        _paragraph.appendChild(_leftDiv);
	        _paragraph.appendChild(_rightDiv);
	        mealContainer.appendChild(_paragraph);
	      }
	    });
	    var calorieElement = document.createElement('h3');
	    calorieElement.setAttribute('class', 'bottom-row');
	    calorieElement.innerHTML = "Total Calories: " + totalCalories.toString();
	    mealContainer.appendChild(calorieElement);

	    mealList.appendChild(mealContainer);
	  });
	}

	function extractValidDates(mealData) {
	  var validDates = [];
	  mealData.forEach(function (meal) {
	    meal.foods.forEach(function (food) {
	      var formattedDate = reformatDateString(food.added);
	      if (!validDates.includes(formattedDate)) {
	        validDates.push(formattedDate);
	      }
	    });
	  });
	  return validDates;
	}

	function reformatDateString(dateString) {
	  var splitString = dateString.split('-');

	  var day = '';
	  while (!isNaN(splitString[2][0].toString())) {
	    day += splitString[2][0];
	    splitString[2] = splitString[2].substring(1);
	  }

	  return splitString[1].toString() + '/' + day + '/' + splitString[0];
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	function request(uri, method, body) {
	  return fetch('https://sheltered-retreat-73227.herokuapp.com' + uri, {
	    method: method,
	    headers: {
	      "Content-Type": "application/json"
	    },
	    body: JSON.stringify(body)
	  });
	}

	module.exports.request = request;

/***/ })
/******/ ]);