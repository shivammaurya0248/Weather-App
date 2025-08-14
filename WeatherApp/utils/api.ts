/* eslint-disable @typescript-eslint/no-unused-vars */

const HOST = 'https://weatherapp-a9ur.onrender.com';
// const HOST = 'http://192.168.108.167:8000';
const API_5_DAY_FORECAST = `/forecast_5_day`;    // Add lat and long to the URL while fetching the data
const API_5_DAY_FORECAST_HOURLY = '/forecast_5_day_hourly';
const API_AQI = `/aqi`;       // Add lat and long to the URL while fetching the data 
const API_CURRENT_DAY_WEATHER = `/current_day_weather`;      // Add lat and long to the URL while fetching the data

export async function get5DayForecast(lat: number, lon: number, city: string) {
    let forecastData = {}
    try{
        const response = await fetch(`${HOST}${API_5_DAY_FORECAST}/${lat}/${lon}/${city}`);
        const data = await response.json();
        forecastData = data;
    }
    catch(error){
        console.error('Error fetching 5-day forecast data:', error);
    }
    return forecastData;
}

export async function get5DayForecastHourly(lat: number, lon: number, city: string) {
  let forecastData = {}
  try{
      const response = await fetch(`${HOST}${API_5_DAY_FORECAST_HOURLY}/${lat}/${lon}/${city}`);
      const data = await response.json();
      forecastData = data;
  }
  catch(error){
      console.error('Error fetching 5-day forecast data:', error);
  }
  return forecastData;
}

export async function getAQI(lat: number, lon: number, city: string) {
    let AQIData = {}
    try{
        const response = await fetch(`${HOST}${API_AQI}/${lat}/${lon}/${city}`);
        const data = await response.json();
        AQIData = data;
    }
    catch(error){
        console.error('Error fetching AQI data:', error);
    }

    return AQIData;
}

export async function getCurrentDayWeather(lat: number, lon: number, city: string) {
    let currentDayWeatherData = {}
    try{
        const response = await fetch(`${HOST}${API_CURRENT_DAY_WEATHER}/${lat}/${lon}/${city}`);
        const data = await response.json();
        currentDayWeatherData = data;
    }
    catch(error){
        console.error('Error fetching current day weather data:', error);
    }

    return currentDayWeatherData;
}
