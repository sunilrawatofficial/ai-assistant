const axios = require("axios");

async function fetchWeather(city) {
   try {
      const response = await axios.get(
         "https://api.openweathermap.org/data/2.5/weather",
         {
            params: {
               q: city,
               appid: "868485f915e26d4f37fcff2c9d1a8737",
               units: "metric",
            },
         },
      );
      
      return response.data;
   } catch (error) {
      console.error("Weather API Error:", error.message);
      return null;
   }
}
module.exports = { fetchWeather };
