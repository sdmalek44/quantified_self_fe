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
    option.setAttribute('id', `${date}`)
    option.value = date
    dropDown.appendChild(option)
  })
  populateMeals(mealData, dropDown.childNodes[0].value)
  let title = document.getElementById("calendar-title")
  title.innerHTML = `Meals from ${dropDown.childNodes[0].value}`
  dropDown.addEventListener("change", function() {
    populateMeals(mealData, this.value)
    let title = document.getElementById("calendar-title")
    title.innerHTML = `Meals from ${this.value}`
  })
}

function populateMeals(mealData, date) {
  let mealList = document.getElementById('meal-list')
  mealList.innerHTML = ''
  mealData.forEach(function(meal) {
    let mealContainer = document.createElement('div')
    mealContainer.setAttribute('class', 'meal-container')
    let mealTitle = document.createElement('div')
    mealTitle.setAttribute('class', 'meal-title')
    mealTitle.innerHTML = meal.name
    mealContainer.appendChild(mealTitle)
    let paragraph = document.createElement('p');
    paragraph.setAttribute('class', 'rows first-row')
    let leftDiv = document.createElement('div');
    leftDiv.setAttribute('class', 'food-name')
    leftDiv.innerHTML = "Food"
    let rightDiv = document.createElement('div');
    rightDiv.setAttribute('class', 'food-calories')
    rightDiv.innerHTML = "Calories"
    paragraph.appendChild(leftDiv)
    paragraph.appendChild(rightDiv)
    mealContainer.appendChild(paragraph)

    let totalCalories = 0
    meal.foods.forEach(function(food) {
      if(reformatDateString(food.added) == date) {
        totalCalories += food.calories
        let paragraph = document.createElement('p');
        let leftDiv = document.createElement('div');
        leftDiv.setAttribute('class', 'food-name')
        leftDiv.innerHTML = food.name
        let rightDiv = document.createElement('div');
        rightDiv.setAttribute('class', 'food-calories')
        rightDiv.innerHTML = food.calories.toString()
        paragraph.setAttribute('class', 'rows')
        paragraph.appendChild(leftDiv)
        paragraph.appendChild(rightDiv)
        mealContainer.appendChild(paragraph)
      }
    })
    let calorieElement = document.createElement('h3')
    calorieElement.setAttribute('class', 'bottom-row')
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
