retrieveFoods()
var foodButton = document.getElementById('food-create-button')
$(foodButton).on('click', function() {
  addFood()
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
    let foodName = document.createElement("p")
    foodName.innerHTML = foods[i].name
    listElement.appendChild(foodName)

    let foodCalories = document.createElement("p")
    foodCalories.innerHTML = foods[i].calories.toString() + " calories"
    listElement.appendChild(foodCalories)

    let space = document.createElement("br")
    listElement.appendChild(foodCalories)
  }
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
