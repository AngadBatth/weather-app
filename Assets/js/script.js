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

// function to actually search the city's weather
function searchFunction() {

    saveSearchHistory(cityEnteredEl.val());
  
    if (!cityEnteredEl.val()) {alert('Invalid Input');} 
    else {
      getLocation(cityEnteredEl.val())
        .then(function (data) {
          var latitude = data[0].lat;
          var longitude = data[0].lon;
          return weatherData(latitude, longitude);})
        .then(function (result) {weatherData(result);});}
  
    cityEnteredEl.val('');
  }

// Function to retrieve City Data using the name of city
function cityData(nameOfCity) {

    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${nameOfCity}&appid=${apiKey}&limit=2`)
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

    cityNameEl.text(val.nameOfCity + ' ' + val.list[0].dt_txt.slice(0,10));

    weatherConditionEl.attr({

        src: `https://openweathermap.org/img/wn/${val.list[0].weather[0].icon}@2x.png`,
        alt: `${val.list[0].weather[0].description}`});


    temperatureEl.text(val.list[0].main.temp + '°C');

    windConditionEl.text(val.list[0].wind.speed + 'm/s');

    humidityRateEl.text(val.list[0].main.humidity + '%');

    fiveDayCardsEl.innerHTML('');

    
    for (var i = 7; i <= val.list.length; i += 8) {

        var fiveDays = $("<div>");
        var fiveDaysWeather = $("<h5>");
        var fiveDaysTemp = $("<div>");
        var fiveDaysWind = $("<div>");
        var fiveDaysHumidity = $("<div>");
        var fiveDaysPng = $("<img>");
    

        fiveDaysWeather.text(val.list[i].dt_txt.slice(0, 10));

        fiveDaysTemp.text("Temp: " + val.list[i].main.temp + "°C");

        fiveDaysWind.text("Wind: " + val.list[i].wind.speed + " m/s");

        fiveDaysHumidity.text("Humidity: " + val.list[i].main.humidity + "%");


        fiveDaysPng.attr({
          src: `https://openweathermap.org/img/wn/${val.list[i].weather[0].icon}@2x.png`,
          alt: `${val.list[i].weather[0].description}`});
    

        fiveDays.addClass("fiveDayWeather-card col");
        fiveDaysWeather.addClass("fiveDayWeather-date m-2");
        fiveDaysPng.addClass("fiveDayWeather-icon");
    
        fiveDayCardsEl.append(fiveDays);
        fiveDays.append(fiveDaysWeather);
        fiveDays.append(fiveDaysPng);
        fiveDays.append(fiveDaysTemp);
        fiveDays.append(fiveDaysWind);
        fiveDays.append(fiveDaysHumidity);
      }
}

// Put all searches into Local storage and add new buttons under search history with searched city's name
var previousSearches = JSON.parse(localStorage.getItem('Previous Searches'));

for (i = 0; i < previousSearches.length; i++) {

  let city = $('<button>');

  if (previousSearches[i]) {
    city.text(previousSearches[i]);
    city.addClass('searchHistoryBtn');
    searchHistoryEl.append(city);
    $('.searchHistoryBtn').on('click', searchHistoryBtn);
  }
}

// Function to save search history
function saveSearchHistory(desiredCity) {

    let city = $('<button>');

    previousSearches.unshift(desiredCity);
    localStorage.setItem('Previous Searches', JSON.stringify(previousSearches));
    city.text(desiredCity);
    city.addClass('searchHistoryBtn');
    searchHistoryEl.prepend(city);
    $('.searchHistoryBtn').on('click', searchHistoryBtn);
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

  searchBtnEl.on('click', searchFunction);