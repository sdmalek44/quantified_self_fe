const request = require('./request.js').request

retrieveCheckboxFoods()
populateMeals()

function retrieveCheckboxFoods() {
  request('/api/v1/foods')
  .then(response => response.json())
  .then(function(data) {populateFoodsCheckbox(data)})
}

function populateFoodsCheckbox(foods) {
  let checkBox = $('#check-box');
  checkBox.html('')
  for(var i in foods){
    $('#check-box').append(`
      <article>
        <input type="checkbox" class="checkbox" id="${foods[i].id}">
        <span>${foods[i].name}</span>
        <span> </span>
        <span>${foods[i].calories}</span>
      </article>
      `)
  }
}



function addToMeal(){
  var checked = $('#check-box article .checkbox:checked');

  if (checked.val()) {
    var mealId = parseInt($('article select').val())
    var foodIds = []
    checked.each(function(index){
      foodIds.push(parseInt(this.id))
    })
    for (var i in foodIds){
      request(`/api/v1/meals/${mealId}/foods/${foodIds[i]}`, 'POST').then(
        function(){
          populateMeals()
          retrieveCheckboxFoods()
        }
      )
    }
  }
}

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
      .then(
        function(){
          populateMeals()
          retrieveCheckboxFoods()
        })
    })
    tableBody.append(`
      <tr>
        <td>${mealFoods[i].name}</td>
        <td>${mealFoods[i].calories}</td>
      </tr>
      `)
      tableBody.children().last().append(button)
  }
  return calorieCount;
}

function populateMeals() {
  request('/api/v1/meals')
    .then(response => response.json())
    .then(function(meals){
      $('article#meals').empty()
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

$('#add-to-meal').on('click', addToMeal)
