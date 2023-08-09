// OpenWeather API Key
const apiKey = '3630deb268097bac1f6b9fffc4749e5e'

// DOM Elements
var cityEnteredEl = document.querySelector('#cityEntered');
var cityNameEl = document.querySelector('#cityName');
var weatherConditionEl = document.querySelector('#weatherCondition');
var temperatureEl = document.querySelector('#temperature');
var windConditionEl = document.querySelector('#windCondition');
var humidityRateEl = document.querySelector('#humidityRate');
var fiveDayCardsEl = document.querySelector('#fiveDayCards');
var searchHistoryEl = document.querySelector('#searchHistory');
var searchBtnEl = document.querySelector('#searchBtn');
var globalBtn = document.createElement('button');

// function to actually search the city's weather
function searchFunction() {

    saveSearchHistory(cityEnteredEl.value);
  
    if (!cityEnteredEl.value) {alert('Please enter a valid city');} 
    else {
      cityData(cityEnteredEl.value)
        .then(function (data) {
          return weatherData(data);})
    }
  }

// Function to retrieve City Data using the name of city
function cityData(nameOfCity) {

    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${apiKey}`)
    .then(function (response) {
        return response.json(); })
    .then(function (data) {
        return data; });
}

// Function to retrieve Weather Data using Lat + Lon
function cityWeather(latitude, longitude) {

    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    .then(function (response) {
        return response.json(); })
    .then(function (data) {
        return data; });
}

// Function to fill page with Weather Data
function weatherData(val) {

  console.log(val);

    cityNameEl.innerHTML = val.name;

    temperatureEl.innerHTML = val.main.temp + '°C';

    windConditionEl.innerHTML = val.wind.speed + ' m/s';

    humidityRateEl.innerHTML = val.main.humidity + '%';

    fiveDayCardsEl.innerHTML = '';
}

// Put all searches into Local storage and add new buttons under search history with searched city's name
var previousSearches = JSON.parse(localStorage.getItem('previous_searches'));

if (previousSearches != null){
  for (i = 0; i < previousSearches.length; i++) {

    if (previousSearches[i]) {
      globalBtn.text(previousSearches[i]);
      globalBtn.addClass('searchHistoryBtn');
      searchHistoryEl.append(globalBtn);
      $('.searchHistoryBtn').on('click', searchHistoryBtn);
    }
  }
}


// Function to save search history
function saveSearchHistory(desiredCity) {

  console.log(previousSearches);
  if(previousSearches != null) {
    previousSearches.unshift(desiredCity);
    localStorage.setItem('previous_searches', JSON.stringify(previousSearches));
    globalBtn.text(desiredCity);
    globalBtn.addClass('searchHistoryBtn');
    searchHistoryEl.prepend(globalBtn);
    $('.searchHistoryBtn').on('click', searchHistoryBtn);
  }
  }

  // function to retrieve data from previously searched cities
  function searchHistoryBtn() {

    cityData($(this).text())
      .then(function (data) {
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        return cityWeather(latitude, longitude); })

      .then(function (result) {
        weatherData(result); });
  }

  searchBtnEl.addEventListener('click', searchFunction);