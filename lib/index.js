const request = require('./request.js').request

retrieveCheckboxFoods()
populateMeals()

function retrieveCheckboxFoods() {
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods')
  .then(response => response.json())
  .then(function(data) {populateFoodsCheckbox(data)})
}

function populateFoodsCheckbox(foods) {
  let listElement = document.getElementById('check-box');
  listElement.innerHTML = ""
  for(var i in foods){
    let article = document.createElement("article")
    listElement.appendChild(article)
    let checkBox = document.createElement("INPUT")
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "checkbox");
    checkBox.setAttribute("id", foods[i].id);

    article.appendChild(checkBox)

    let foodName = document.createElement("span")
    foodName.innerHTML = foods[i].name + " - "
    article.appendChild(foodName)

    let foodCalories = document.createElement("span")
    foodCalories.innerHTML = foods[i].calories.toString() + " calories"
    article.appendChild(foodCalories)

    let space = document.createElement("br")
    article.appendChild(foodCalories)
  }
}

$('#add-to-meal').on('click', function(){
  var checked = $('#check-box article .checkbox:checked');
  if (checked.val()) {
    var foodIds = []
    checked.each(function(index){
      foodIds.push(parseInt(this.id))
    })
    var mealId = parseInt($('article select').val())
    for (var i in foodIds){
      fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals/${mealId}/foods/${foodIds[i]}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        }
      })
    }
    retrieveCheckboxFoods()
  }
})

function populateMeal(meal){
  var meals = $('#meals')
  meals.append(`
    <table id="${meal.id}">
      <caption>${meal.name}</caption>
      <thead>
        <td>Name</td>
        <td>Calories</td>
      </thead>
      <tbody>
      </tbody>
    </table>`)
  var mealFoods = meal.foods
  var tableBody = meals.children(`table#${meal.id}`).children('tbody')
  var calorieCount = 0
  for (var i in mealFoods) {
    calorieCount += parseInt(mealFoods[i].calories)
    var button = document.createElement('button')
    button.setAttribute('id', mealFoods[i].id)
    button.innerHTML = 'Delete'
    $(button).on('click', function(){
      request(`/api/v1/meals/${meal.id}/foods/${this.id}`, 'DELETE')
    })
    tableBody.append(`
      <tr>
        <td>${mealFoods[i].name}</td>
        <td>${mealFoods[i].calories}</td>
        <td></td>
      </tr>
      `)
    tableBody.children().last().append(button)
  }
  return calorieCount;
}

function populateMeals() {
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals')
    .then(response => response.json())
    .then(function(meals){
      var totalCalorieCount = 0
      for (var i in meals) {
        var calorieCount = populateMeal(meals[i])
        totalCalorieCount += calorieCount
        $(`#meals table#${meals[i].id} tbody`).append(`
          <tr>
            <td>Total Calories</td>
            <td>${calorieCount}</td>
          </tr>
          <tr>
            <td>Remaining Calories</td>
            <td>${2000 - calorieCount}</td>
          </tr>
          `)
      }
      populateTotalCalories(totalCalorieCount)
    })
}

function populateTotalCalories(totalCalCount){
  $(`#meals`).append(`
      <table>
        <caption>Totals</caption>
        <thead>
          <td></td>
          <td></td>
        </thead>
        <tbody>
        <tr>
          <td>Goal Calories</td>
          <td>2000</td>
        </tr>
        <tr>
          <td>Calories Consumed</td>
          <td>${totalCalCount}</td>
        </tr>
        <tr>
          <td>Remaining Calories</td>
          <td>${2000 - totalCalCount}</td>
        </tr>
      </tbody>
    </table>
  `)
}
