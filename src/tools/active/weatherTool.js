const { fetchWeather } = require("../../services/weatherService");

async function getWeatherInfo(query) {
   //Simple city extraction
   const city = query.replace(/weather in/i, "").trim();
   const data = await fetchWeather(city);
   if (!data) {
      return "Unable to fetch weather information.";
   }
   return {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      weather: data.weather[0].description,
      windSpeed: data.wind.speed,
   };

}

module.exports = { getWeatherInfo };
