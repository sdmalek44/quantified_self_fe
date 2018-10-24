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

	retrieveCheckboxFoods();
	populateMeals();

	function retrieveCheckboxFoods() {
	  request('/api/v1/foods').then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    populateFoodsCheckbox(data);
	  });
	}

	function populateFoodsCheckbox(foods) {
	  var checkBox = $('#check-box');
	  checkBox.html('');
	  for (var i in foods) {
	    $('#check-box').append('\n      <article class="food-row fake-b">\n        <input type="checkbox" class="checkbox" id="' + foods[i].id + '">\n        <span>' + foods[i].name + '</span>\n        <span class="fake-l">' + foods[i].calories + '</span>\n      </article>\n      ');
	  }
	}

	function addToMeal() {
	  var checked = $('#check-box article .checkbox:checked');

	  if (checked.val()) {
	    var mealId = parseInt($('article select').val());
	    var foodIds = [];
	    checked.each(function (index) {
	      foodIds.push(parseInt(this.id));
	    });
	    for (var i in foodIds) {
	      request('/api/v1/meals/' + mealId + '/foods/' + foodIds[i], 'POST').then(function () {
	        populateMeals();
	        retrieveCheckboxFoods();
	      });
	    }
	  }
	}

	function populateMeal(meal) {
	  var meals = $('#meals');
	  meals.append('\n    <table id="' + meal.id + '">\n      <caption>' + meal.name + '</caption>\n      <thead>\n        <td>Name</td>\n        <td>Calories</td>\n      </thead>\n      <tbody>\n      </tbody>\n    </table>');
	  var mealFoods = meal.foods;
	  var tableBody = meals.children('table#' + meal.id).children('tbody');
	  var calorieCount = 0;
	  for (var i in mealFoods) {
	    calorieCount += parseInt(mealFoods[i].calories);
	    var button = document.createElement('button');
	    button.setAttribute('id', mealFoods[i].id);
	    button.innerHTML = 'remove';
	    $(button).on('click', function () {
	      request('/api/v1/meals/' + meal.id + '/foods/' + this.id, 'DELETE').then(function () {
	        populateMeals();
	        retrieveCheckboxFoods();
	      });
	    });
	    tableBody.append('\n      <tr>\n        <td>' + mealFoods[i].name + '</td>\n        <td>' + mealFoods[i].calories + '</td>\n      </tr>\n      ');
	    tableBody.children().last().append(button);
	  }
	  return calorieCount;
	}

	function populateMeals() {
	  request('/api/v1/meals').then(function (response) {
	    return response.json();
	  }).then(function (meals) {
	    var mealContainer = document.getElementById('meal-container');
	    mealContainer.innerHTML = "";
	    $('article#meals').empty();
	    var totalCalorieCount = 0;
	    for (var i in meals) {
	      var meal = meals[i];
	      var newOption = document.createElement('option');
	      newOption.value = meal.id;
	      newOption.innerHTML = meal.name;
	      mealContainer.appendChild(newOption);
	      var calorieCount = populateMeal(meals[i]);
	      totalCalorieCount += calorieCount;
	      $('#meals table#' + meal.id + ' tbody').append('\n          <tr>\n            <td>Total Calories</td>\n            <td>' + calorieCount + '</td>\n          </tr>\n          <tr>\n            <td>Remaining Calories</td>\n            <td>' + (2000 - calorieCount) + '</td>\n          </tr>\n          ');
	    }
	    populateTotalCalories(totalCalorieCount);
	  });
	}

	function populateTotalCalories(totalCalCount) {
	  $('#meals').append('\n      <table>\n        <caption>Totals</caption>\n        <tbody>\n        <tr>\n          <td>Goal Calories</td>\n          <td>2000</td>\n        </tr>\n        <tr>\n          <td>Calories Consumed</td>\n          <td>' + totalCalCount + '</td>\n        </tr>\n        <tr>\n          <td>Remaining Calories</td>\n          <td>' + (2000 - totalCalCount) + '</td>\n        </tr>\n      </tbody>\n    </table>\n  ');
	}

	$('#add-to-meal').on('click', addToMeal);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	function request(uri, method, body) {
	  return fetch('https://quant-self-api.herokuapp.com' + uri, {
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