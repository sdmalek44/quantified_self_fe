const request = require('./request.js').request

retrieveFoods()
$('#food-create-button').on('click', function() {
  addFood()
  document.getElementById('food-name-box').value = ""
  document.getElementById('food-calories-box').value = ""
})

$('#filter-foods').on('input', function() {
  filterFoods()
})

function filterFoods() {
  let foodList = document.getElementById('food-list').childNodes
  for(var i in foodList) {
    let foodContainer = foodList[i]
    if(typeof foodContainer == "object" && foodContainer.hasChildNodes()) {
      let filterText = document.getElementById('filter-foods').value.toLowerCase()
      if(filterText != "") {
        let foodName = foodContainer.childNodes[0].innerHTML.toLowerCase()
        if(foodName.includes(filterText)) {
          foodContainer.className = "food-container"
        } else {
          foodContainer.className = "hidden-container"
        }
      } else {
        foodContainer.className = "food-container"
      }
    }
  }
}

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
    foodContainer.className = "food-container"
    foodContainer.id = food.id.toString()

    let foodName = document.createElement("p")
    foodName.innerHTML = food.name
    foodName.className = "food-name"

    let foodCalories = document.createElement("p")
    foodCalories.innerHTML = food.calories.toString() + " calories"
    foodCalories.className = "food-calories";

    let buttons = document.createElement("p")

    let deleteButton = document.createElement("button")
    deleteButton.innerHTML = "delete"
    deleteButton.className = "change"
    $(deleteButton).on("click", function() {
      deleteFood(food.id)
    })
    buttons.appendChild(deleteButton)

    let editButton = document.createElement("button")
    editButton.className = "change"
    editButton.innerHTML = "edit"
    $(editButton).on("click", function() {
      editMenu(foodContainer, editButton)
    })
    buttons.appendChild(editButton)

    foodContainer.appendChild(foodName)
    foodContainer.appendChild(foodCalories)
    foodContainer.appendChild(buttons)
    listElement.appendChild(foodContainer)
  }
  filterFoods()
}

function clearEditMenu(foodContainer, foodEdit, editButton) {
  $(editButton).off("click")
  foodContainer.removeChild(foodEdit)
  $(editButton).on("click", function() {
    editMenu(foodContainer, editButton)
  })
}

function editMenu(foodContainer, editButton) {
  let foodEdit = document.createElement("div")

  $(editButton).off("click")
  $(editButton).on("click", function() {
    clearEditMenu(foodContainer, foodEdit, editButton)
  })

  let nameText = document.createTextNode("Name: ")
  foodEdit.appendChild(nameText)

  let nameBox = document.createElement("input")
  nameBox.type = "text"
  foodEdit.appendChild(nameBox)

  foodEdit.appendChild(document.createElement('br'))
  foodEdit.appendChild(document.createElement('br'))

  let caloriesText = document.createTextNode("Calories: ")
  foodEdit.appendChild(caloriesText)

  let caloriesBox = document.createElement("input")
  caloriesBox.type = "text"
  foodEdit.appendChild(caloriesBox)

  foodEdit.appendChild(document.createElement('br'))

  let submitButton = document.createElement("button")
  submitButton.className = "edit-submit-button"
  submitButton.className += " change"
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
      "calories": parseInt(caloriesBox.value)
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
