retrieveCheckboxFoods()

function retrieveCheckboxFoods() {
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/foods')
  .then(response => response.json())
  .then(function(data) {populateFoodsCheckbox(data)})
}

function populateMealsDropdown(){

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
  var mealTable = document.createElement('table')
  var head = document.createElement('thead')
  head.setAttribute('id', meal.id)
  var body = document.createElement('tbody')
  mealTable.appendChild()
} //WIP

function populateMeals() {
  fetch('https://fast-meadow-36413.herokuapp.com/api/v1/meals')
    .then(response => response.json())
    .then(function(meals){
      for (var i in meals) {
        populateMeal(meals[i])
      }
    })
}
