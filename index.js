
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const clearHistoryButton = document.querySelector("#clear-history");
const historyForm = document.querySelector("#history");
const cityName = document.querySelector("#city-name");
const currentPic = document.querySelector("#current-pic");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const forecastDivs = document.querySelectorAll(".forecast");


let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


searchHistory.forEach(city => {
    addToHistory(city);
});

const YOUR_API_KEY = "e5251a5c9512fc4256764981ad150361"
searchButton.addEventListener("click", function () {
    const city = cityInput.value;

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=` + YOUR_API_KEY)
        .then(response => {

            const data = response.data;

            cityName.textContent = data.name;
            currentPic.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            temperature.textContent = `Temperature: ${data.main.temp} °F`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;


            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=` + YOUR_API_KEY)
                .then(response => {
                    const forecastData = response.data.list;

                    // Loop through the forecast data and update the forecast divs
                    forecastData.forEach((day, index) => {
                        if (index < forecastDivs.length) {
                            forecastDivs[index].textContent = `${day.dt_txt} - ${day.main.temp} °F`;
                        }
                    });
                });


            addToHistory(city);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        });

    clearHistoryButton.addEventListener("click", () => {

        searchHistory = [];
        historyForm.innerHTML = "";
        localStorage.removeItem("searchHistory");
    });




    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.forEach(city => {
        addToHistory(city);
    });
});

function addToHistory(city) {

    const cityButton = document.createElement("button");
    cityButton.classList.add("list-group-item");
    cityButton.textContent = city;

    historyForm.innerHTML = ''
    historyForm.appendChild(cityButton);

    searchHistory.push(city);


    cityButton.addEventListener("click", event => {
        cityInput.value = event.target.textContent;
        searchButton.click();
    });
}

