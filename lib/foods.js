const request = require('./request.js').request

retrieveFoods()
var foodButton = document.getElementById('food-create-button')
$(foodButton).on('click', function() {
  addFood()
  document.getElementById('food-name-box').value = ""
  document.getElementById('food-calories-box').value = ""
})

function retrieveFoods() {
  request('/api/v1/foods')
  .then(response => response.json())
  .then(data => populateFoods(data))
}

function populateFoods(foods) {
  let listElement = document.getElementById('food-list');
  listElement.innerHTML = ""
  for(var i in foods){
    let food = foods[i]
    let foodContainer = document.createElement("div")
    foodContainer.id = food.id.toString()

    let foodInfo = document.createElement("p")
    foodInfo.innerHTML = foods[i].name + ": " + foods[i].calories.toString() + " calories"

    let deleteButton = document.createElement("button")
    deleteButton.innerHTML = "delete"
    $(deleteButton).on("click", function() {
      deleteFood(food.id)
    })
    foodInfo.appendChild(deleteButton)

    let editButton = document.createElement("button")
    editButton.innerHTML = "edit"
    $(editButton).on("click", function() {
      editMenu(foodContainer, editButton)
    })
    foodInfo.appendChild(editButton)

    foodContainer.appendChild(foodInfo)
    listElement.appendChild(foodContainer)
  }
}

function clearEditMenu(foodContainer, foodEdit, editButton) {
  $(editButton).off("click")
  foodContainer.removeChild(foodEdit)
  $(editButton).on("click", function() {
    editMenu(foodContainer, editButton)
  })
}

function editMenu(foodContainer, editButton) {
  let foodEdit = document.createElement("p")

  $(editButton).off("click")
  $(editButton).on("click", function() {
    clearEditMenu(foodContainer, foodEdit, editButton)
  })

  let nameText = document.createTextNode("Name: ")
  foodEdit.appendChild(nameText)

  let nameBox = document.createElement("input")
  nameBox.type = "text"
  foodEdit.appendChild(nameBox)

  let caloriesText = document.createTextNode("Calories: ")
  foodEdit.appendChild(caloriesText)

  let caloriesBox = document.createElement("input")
  caloriesBox.type = "text"
  foodEdit.appendChild(caloriesBox)

  let submitButton = document.createElement("button")
  submitButton.innerHTML = "submit"
  $(submitButton).on("click", function(){
    editFood(foodContainer.id, nameBox, caloriesBox)
  })
  foodEdit.appendChild(submitButton)

  foodContainer.appendChild(foodEdit)
}

function editFood(foodId, nameBox, caloriesBox) {
  let body = {
    food: {
      "name": nameBox.value,
      "calories": caloriesBox.value
    }
  }
  request('/api/v1/foods/' + foodId, "PATCH", body)
  .then(function() {retrieveFoods()})
}

function deleteFood(foodId) {
  request('/api/v1/foods/' + foodId.toString(), "DELETE")
  .then(function() {retrieveFoods()})
}

function addFood()
{
  let foodName = document.getElementById('food-name-box').value
  let foodCalories = parseInt(document.getElementById('food-calories-box').value)
  var body = {
    food: {
      name: foodName,
      calories: foodCalories
    }
  }
  request('/api/v1/foods', "POST", body)
  .then(function() {retrieveFoods()})
}
