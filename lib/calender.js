const request = require('./request').request

fetchMeals()

function fetchMeals() {
  request('/api/v1/meals')
  .then(response => response.json())
  .then(mealData => populateDateDropDown(mealData))
}

function populateDateDropDown(mealData) {
  let dropDown = document.getElementById('date-drop-down')
  let validDates = extractValidDates(mealData)
  validDates.forEach(function(date) {
    let option = document.createElement('option')
    option.innerHTML = date
    option.value = date
    dropDown.appendChild(option)
  })
  dropDown.addEventListener("change", function() {
    populateMeals(mealData, this.value)
  })
}

function populateMeals(mealData, date) {
  let mealList = document.getElementById('meal-list')
  mealList.innerHTML = ''
  mealData.forEach(function(meal) {
    let mealContainer = document.createElement('div')
    let mealTitle = document.createElement('h2')
    mealTitle.innerHTML = meal.name
    mealContainer.appendChild(mealTitle)

    let totalCalories = 0
    meal.foods.forEach(function(food) {
      if(reformatDateString(food.added) == date) {
        totalCalories += food.calories
        let text = food.name + ': ' + food.calories.toString() + ' calories'
        let paragraph = document.createElement('p')
        paragraph.innerHTML = text
        mealContainer.appendChild(paragraph)
      }
    })
    let calorieElement = document.createElement('h3')
    calorieElement.innerHTML = "Total Calories: " + totalCalories.toString()
    mealContainer.appendChild(calorieElement)

    mealList.appendChild(mealContainer)
  })
}

function extractValidDates(mealData) {
  let validDates = []
  mealData.forEach(function(meal) {
    meal.foods.forEach(function(food) {
      let formattedDate = reformatDateString(food.added)
      if(!validDates.includes(formattedDate)) {
        validDates.push(formattedDate)
      }
    })
  })
  return validDates
}

function reformatDateString(dateString) {
  let splitString = dateString.split('-')

  let day = ''
  while(!isNaN(splitString[2][0].toString())) {
    day += splitString[2][0]
    splitString[2] = splitString[2].substring(1)
  }

  return splitString[1].toString() + '/' + day + '/' + splitString[0]
}
