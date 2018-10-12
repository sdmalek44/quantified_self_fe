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

	retrieveFoods();
	var foodButton = document.getElementById('food-create-button');
	$(foodButton).on('click', function () {
	  addFood();
	  document.getElementById('food-name-box').value = "";
	  document.getElementById('food-calories-box').value = "";
	});

	function retrieveFoods() {
	  request('/api/v1/foods').then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    return populateFoods(data);
	  });
	}

	function populateFoods(foods) {
	  var listElement = document.getElementById('food-list');
	  listElement.innerHTML = "";

	  var _loop = function _loop() {
	    var food = foods[i];
	    var foodContainer = document.createElement("div");
	    foodContainer.className = "food-container";
	    foodContainer.id = food.id.toString();

	    var foodName = document.createElement("p");
	    foodName.innerHTML = food.name;
	    foodName.className = "food-name";

	    var foodCalories = document.createElement("p");
	    foodCalories.innerHTML = food.calories.toString() + " calories";
	    foodCalories.className = "food-calories";

	    var buttons = document.createElement("p");

	    var deleteButton = document.createElement("button");
	    deleteButton.innerHTML = "delete";
	    deleteButton.className = "change";
	    $(deleteButton).on("click", function () {
	      deleteFood(food.id);
	    });
	    buttons.appendChild(deleteButton);

	    var editButton = document.createElement("button");
	    editButton.className = "change";
	    editButton.innerHTML = "edit";
	    $(editButton).on("click", function () {
	      editMenu(foodContainer, editButton);
	    });
	    buttons.appendChild(editButton);

	    foodContainer.appendChild(foodName);
	    foodContainer.appendChild(foodCalories);
	    foodContainer.appendChild(buttons);
	    listElement.appendChild(foodContainer);
	  };

	  for (var i in foods) {
	    _loop();
	  }
	}

	function clearEditMenu(foodContainer, foodEdit, editButton) {
	  $(editButton).off("click");
	  foodContainer.removeChild(foodEdit);
	  $(editButton).on("click", function () {
	    editMenu(foodContainer, editButton);
	  });
	}

	function editMenu(foodContainer, editButton) {
	  var foodEdit = document.createElement("div");

	  $(editButton).off("click");
	  $(editButton).on("click", function () {
	    clearEditMenu(foodContainer, foodEdit, editButton);
	  });

	  var nameText = document.createTextNode("Name: ");
	  foodEdit.appendChild(nameText);

	  var nameBox = document.createElement("input");
	  nameBox.type = "text";
	  foodEdit.appendChild(nameBox);

	  foodEdit.appendChild(document.createElement('br'));
	  foodEdit.appendChild(document.createElement('br'));

	  var caloriesText = document.createTextNode("Calories: ");
	  foodEdit.appendChild(caloriesText);

	  var caloriesBox = document.createElement("input");
	  caloriesBox.type = "text";
	  foodEdit.appendChild(caloriesBox);

	  foodEdit.appendChild(document.createElement('br'));

	  var submitButton = document.createElement("button");
	  submitButton.className = "edit-submit-button";
	  submitButton.className += " change";
	  submitButton.innerHTML = "submit";
	  $(submitButton).on("click", function () {
	    editFood(foodContainer.id, nameBox, caloriesBox);
	  });
	  foodEdit.appendChild(submitButton);

	  foodContainer.appendChild(foodEdit);
	}

	function editFood(foodId, nameBox, caloriesBox) {
	  var body = {
	    food: {
	      "name": nameBox.value,
	      "calories": caloriesBox.value
	    }
	  };
	  request('/api/v1/foods/' + foodId, "PATCH", body).then(function () {
	    retrieveFoods();
	  });
	}

	function deleteFood(foodId) {
	  request('/api/v1/foods/' + foodId.toString(), "DELETE").then(function () {
	    retrieveFoods();
	  });
	}

	function addFood() {
	  var foodName = document.getElementById('food-name-box').value;
	  var foodCalories = parseInt(document.getElementById('food-calories-box').value);
	  var body = {
	    food: {
	      name: foodName,
	      calories: foodCalories
	    }
	  };
	  request('/api/v1/foods', "POST", body).then(function () {
	    retrieveFoods();
	  });
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	function request(uri, method, body) {
	  return fetch('https://rails-quantified-self.herokuapp.com' + uri, {
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