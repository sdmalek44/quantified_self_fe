retrieveFoods()
var foodButton = document.getElementById('food-create-button')
$(foodButton).on('click', function() {
  addFood()
  document.getElementById('food-name-box').value = ""
  document.getElementById('food-calories-box').value = ""
})

function retrieveFoods() {
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods')
  .then(response => response.json())
  .then(function(data) {populateFoods(data)})
}

function populateFoods(foods) {
  let listElement = document.getElementById('food-list');
  listElement.innerHTML = ""
  for(var i in foods){
    let food = foods[i]
    let foodInfo = document.createElement("p")
    foodInfo.innerHTML = foods[i].name + ": " + foods[i].calories.toString() + " calories"
    let deleteButton = document.createElement("button")
    deleteButton.innerHTML = "delete"
    $(deleteButton).on("click", function() {
      deleteFood(food.id)
    })
    foodInfo.appendChild(deleteButton)
    listElement.appendChild(foodInfo)
  }
}

function deleteFood(foodId) {
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods/' + foodId.toString(), {
    method: "DELETE"
  })
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
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods', {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  .then(function() {retrieveFoods()})
}
