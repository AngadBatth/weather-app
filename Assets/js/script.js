const apiKey = "3630deb268097bac1f6b9fffc4749e5e"

function cityData(nameOfCity) {

    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${nameOfCity}&appid=${apiKey}&limit=2`)
    .then(function (response) {
        return response.json(); })
    .then(function (data) {
        return data; });
}