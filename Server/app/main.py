from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import httpx
from datetime import datetime
from collections import Counter
import redis
import json
import redis.asyncio
from config import settings

if settings.testing:
    redis_client = redis.asyncio.from_url(settings.REDIS_URL_local, encoding="utf8", decode_responses=True)
else:
    redis_client = redis.asyncio.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)

HOST = 'https://api.openweathermap.org'

API_5_DAY_FORECAST = f"/data/2.5/forecast?appid={settings.API_KEY}&units=metric"
API_AQI = f"/data/2.5/air_pollution?appid={settings.API_KEY}&units=metric"
API_CURRENT_DAY_WEATHER = f"/data/2.5/weather?appid={settings.API_KEY}&units=metric"

URL_5_DAY_FORECAST = f"{HOST}{API_5_DAY_FORECAST}"
URL_AQI = f"{HOST}{API_AQI}"
URL_CURRENT_DAY_WEATHER = f"{HOST}{API_CURRENT_DAY_WEATHER}"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)





def transform_5_day_forecast(forecast_data: dict):
    transformed_data = {}
    city = forecast_data.get("city", {}).get("name")
    if not city:
        return {}

    transformed_data[city] = {}
    daily_data = {}

    for item in forecast_data.get("list", []):
        date = datetime.fromtimestamp(item.get("dt", 0)).strftime('%d-%m-%Y')
        if date not in daily_data:
            daily_data[date] = []
        daily_data[date].append(item)

    for date, items in daily_data.items():
        if not items:
            continue
        
        avg_temp = round(sum(i.get("main", {}).get("temp", 0) for i in items) / len(items), 2)
        avg_feels_like = round(sum(i.get("main", {}).get("feels_like", 0) for i in items) / len(items), 2)
        avg_temp_min = round(min(i.get("main", {}).get("temp_min", 0) for i in items), 2)
        avg_temp_max = round(max(i.get("main", {}).get("temp_max", 0) for i in items), 2)
        # avg_temp_min = round(sum(i.get("main", {}).get("temp_min", 0) for i in items) / len(items), 2)
        # avg_temp_max = round(sum(i.get("main", {}).get("temp_max", 0) for i in items) / len(items), 2)
        avg_pressure = int(sum(i.get("main", {}).get("pressure", 0) for i in items) / len(items))
        avg_sea_level = int(sum(i.get("main", {}).get("sea_level", 0) for i in items) / len(items))
        avg_grnd_level = int(sum(i.get("main", {}).get("grnd_level", 0) for i in items) / len(items))
        avg_humidity = int(sum(i.get("main", {}).get("humidity", 0) for i in items) / len(items))
        avg_pop = round(sum(i.get("pop", 0) for i in items) / len(items), 2)
        avg_wind_speed = round(sum(i.get("wind", {}).get("speed", 0) for i in items) / len(items), 2)
        avg_wind_deg = int(sum(i.get("wind", {}).get("deg", 0) for i in items) / len(items))
        avg_wind_gust = round(sum(i.get("wind", {}).get("gust", 0) for i in items) / len(items), 2)
        avg_clouds = int(sum(i.get("clouds", {}).get("all", 0) for i in items) / len(items))
        avg_rain = round(sum(i.get("rain", {}).get("3h", 0) for i in items) / len(items), 2)
        avg_snow = round(sum(i.get("snow", {}).get("3h", 0) for i in items) / len(items), 2)
        avg_visibility = int(sum(i.get("visibility", 0) for i in items) / len(items))

        weather_counts = Counter(i.get("weather", [{}])[0].get("main") for i in items if i.get("weather"))
        weather = weather_counts.most_common(1)[0][0] if weather_counts else "N/A"

        desc_counts = Counter(i.get("weather", [{}])[0].get("description") for i in items if i.get("weather"))
        description = desc_counts.most_common(1)[0][0] if desc_counts else "N/A"

        transformed_data[city][date] = {
            "avg_temp": avg_temp,
            "avg_feels_like": avg_feels_like,
            "avg_temp_min": avg_temp_min,
            "avg_temp_max": avg_temp_max,
            "avg_pressure": avg_pressure,
            "avg_sea_level": avg_sea_level,
            "avg_grnd_level": avg_grnd_level,
            "avg_humidity": avg_humidity,
            "weather": weather,
            "description": description,
            "avg_pop": avg_pop,
            "avg_wind_speed": avg_wind_speed,
            "avg_wind_deg": avg_wind_deg,
            "avg_wind_gust": avg_wind_gust,
            "visibility": avg_visibility,
            "avg_rain": avg_rain,
            "avg_snow": avg_snow,
            "avg_clouds": avg_clouds,
        }
    transformed_data["fetched_at"] = datetime.now().isoformat()
    return transformed_data

def transform_5_day_forecast_day_night(forecast_data: dict):
    transformed_data = {}
    city = forecast_data.get("city", {}).get("name")
    if not city:
        return {}

    transformed_data[city] = {}
    daily_data = {}

    for item in forecast_data.get("list", []):
        date = datetime.fromtimestamp(item.get("dt", 0)).strftime('%d-%m-%Y')
        if date not in daily_data:
            daily_data[date] = {"day": [], "night": []}
        
        pod = item.get("sys", {}).get("pod")
        if pod == "d":
            daily_data[date]["day"].append(item)
        elif pod == "n":
            daily_data[date]["night"].append(item)

    for date, periods in daily_data.items():
        transformed_data[city][date] = {}
        for period, items in periods.items():
            if not items:
                continue
            avg_temp = round(sum(i.get("main", {}).get("temp", 0) for i in items) / len(items), 2)
            avg_feels_like = round(sum(i.get("main", {}).get("feels_like", 0) for i in items) / len(items), 2)
            avg_temp_min = round(min(i.get("main", {}).get("temp_min", 0) for i in items), 2)
            avg_temp_max = round(max(i.get("main", {}).get("temp_max", 0) for i in items), 2)
            # avg_temp_min = round(sum(i.get("main", {}).get("temp_min", 0) for i in items) / len(items), 2)
            # avg_temp_max = round(sum(i.get("main", {}).get("temp_max", 0) for i in items) / len(items), 2)
            avg_pressure = int(sum(i.get("main", {}).get("pressure", 0) for i in items) / len(items))
            avg_sea_level = int(sum(i.get("main", {}).get("sea_level", 0) for i in items) / len(items))
            avg_grnd_level = int(sum(i.get("main", {}).get("grnd_level", 0) for i in items) / len(items))
            avg_humidity = int(sum(i.get("main", {}).get("humidity", 0) for i in items) / len(items))
            avg_pop = round(sum(i.get("pop", 0) for i in items) / len(items), 2)
            avg_wind_speed = round(sum(i.get("wind", {}).get("speed", 0) for i in items) / len(items), 2)
            avg_wind_deg = int(sum(i.get("wind", {}).get("deg", 0) for i in items) / len(items))
            avg_wind_gust = round(sum(i.get("wind", {}).get("gust", 0) for i in items) / len(items), 2)
            avg_clouds = int(sum(i.get("clouds", {}).get("all", 0) for i in items) / len(items))
            avg_rain = round(sum(i.get("rain", {}).get("3h", 0) for i in items) / len(items), 2)
            avg_snow = round(sum(i.get("snow", {}).get("3h", 0) for i in items) / len(items), 2)
            avg_visibility = int(sum(i.get("visibility", 0) for i in items) / len(items))

            weather_counts = Counter(i.get("weather", [{}])[0].get("main") for i in items if i.get("weather"))
            weather = weather_counts.most_common(1)[0][0] if weather_counts else "N/A"

            desc_counts = Counter(i.get("weather", [{}])[0].get("description") for i in items if i.get("weather"))
            description = desc_counts.most_common(1)[0][0] if desc_counts else "N/A"

            transformed_data[city][date][period] = {
                "avg_temp": avg_temp,
                "avg_feels_like": avg_feels_like,
                "avg_temp_min": avg_temp_min,
                "avg_temp_max": avg_temp_max,
                "avg_pressure": avg_pressure,
                "avg_sea_level": avg_sea_level,
                "avg_grnd_level": avg_grnd_level,
                "avg_humidity": avg_humidity,
                "weather": weather,
                "description": description,
                "avg_pop": avg_pop,
                "avg_wind_speed": avg_wind_speed,
                "avg_wind_deg": avg_wind_deg,
                "avg_wind_gust": avg_wind_gust,
                "visibility": avg_visibility,
                "avg_rain": avg_rain,
                "avg_snow": avg_snow,
                "avg_clouds": avg_clouds,
            }
    transformed_data["fetched_at"] = datetime.now().isoformat()
    return transformed_data

def transform_5_day_forecast_hourly(forecast_data: dict):
    transformed_data = []
    transformed_data.append(datetime.now().isoformat())

    for item in forecast_data.get("list", []):
        date_str = datetime.fromtimestamp(item.get("dt", 0)).strftime('%d-%m-%Y')
        time_str = datetime.fromtimestamp(item.get("dt", 0)).strftime('%H:%M')
        
        temp_item = {
            "date_": date_str,
            "time_": time_str,
            "temp": item.get("main", {}).get("temp"),
            "feels_like": item.get("main", {}).get("feels_like"),
            "temp_min": item.get("main", {}).get("temp_min"),
            "temp_max": item.get("main", {}).get("temp_max"),
            "pressure": item.get("main", {}).get("pressure"),
            "sea_level": item.get("main", {}).get("sea_level"),
            "grnd_level": item.get("main", {}).get("grnd_level"),
            "humidity": item.get("main", {}).get("humidity"),
            "weather": item.get("weather", [{}])[0].get("main"),
            "description": item.get("weather", [{}])[0].get("description"),
            "pop": item.get("pop"),
            "wind_speed": item.get("wind", {}).get("speed"),
            "wind_deg": item.get("wind", {}).get("deg"),
            "wind_gust": item.get("wind", {}).get("gust"),
            "visibility": item.get("visibility"),
            "rain": item.get("rain", {}).get('3h', 0),
            "snow": item.get("snow", {}).get('3h', 0),
            "clouds": item.get("clouds", {}).get("all"),
        }
        transformed_data.append([temp_item])
    return transformed_data

def transform_aqi(aqi_data: dict):
    if not aqi_data.get("list"):
        return {}
    
    list_item = aqi_data["list"][0]
    main_data = list_item.get("main", {})
    components_data = list_item.get("components", {})
        
    return {
        "fetched_at": datetime.now().isoformat(),
        "published_at": datetime.fromtimestamp(list_item.get("dt", 0)).isoformat(),
        "aqi": main_data.get("aqi"),
        "co": components_data.get("co"),
        "no": components_data.get("no"),
        "no2": components_data.get("no2"),
        "o3": components_data.get("o3"),
        "so2": components_data.get("so2"),
        "pm2_5": components_data.get("pm2_5"),
        "pm10": components_data.get("pm10"),
        "nh3": components_data.get("nh3"),
    }

def transform_current_day_weather(current_day_weather_data: dict):
    if not current_day_weather_data:
        return {}

    return {
        "fetched_at": datetime.now().isoformat(),
        "city": current_day_weather_data.get("name"),
        "temp": current_day_weather_data.get("main", {}).get("temp"),
        "feels_like": current_day_weather_data.get("main", {}).get("feels_like"),
        "temp_min": current_day_weather_data.get("main", {}).get("temp_min"),
        "temp_max": current_day_weather_data.get("main", {}).get("temp_max"),
        "pressure": current_day_weather_data.get("main", {}).get("pressure"),
        "sea_level": current_day_weather_data.get("main", {}).get("sea_level"),
        "grnd_level": current_day_weather_data.get("main", {}).get("grnd_level"),
        "humidity": current_day_weather_data.get("main", {}).get("humidity"),
        "weather": current_day_weather_data.get("weather", [{}])[0].get("main"),
        "description": current_day_weather_data.get("weather", [{}])[0].get("description"),
        "wind_speed": current_day_weather_data.get("wind", {}).get("speed"),
        "wind_deg": current_day_weather_data.get("wind", {}).get("deg"),
        "wind_gust": current_day_weather_data.get("wind", {}).get("gust"),
        "visibility": current_day_weather_data.get("visibility"),
        "rain": current_day_weather_data.get("rain", {}).get('1h', 0),
        "snow": current_day_weather_data.get("snow", {}).get('1h', 0),
        "clouds": current_day_weather_data.get("clouds", {}).get("all"),
        "sunrise": datetime.fromtimestamp(current_day_weather_data.get("sys", {}).get("sunrise", 0)).strftime('%H:%M'),
        "sunset": datetime.fromtimestamp(current_day_weather_data.get("sys", {}).get("sunset", 0)).strftime('%H:%M'),
    }

async def get_5_day_forecast(lat: float, lon: float):
    async with httpx.AsyncClient() as client:
        url = f"{URL_5_DAY_FORECAST}&lat={lat}&lon={lon}"
        print(url)
        response = await client.get(url)
        print(f"Fetching 5 day forecast")
        response.raise_for_status()
        return response.json()

async def get_aqi(lat: float, lon: float):
    async with httpx.AsyncClient() as client:
        url = f"{URL_AQI}&lat={lat}&lon={lon}"
        print(url)
        response = await client.get(url)
        print(f"Fetching AQI Data")
        response.raise_for_status()
        return response.json()

async def get_current_day_weather(lat: float, lon: float):
    async with httpx.AsyncClient() as client:
        url = f"{URL_CURRENT_DAY_WEATHER}&lat={lat}&lon={lon}"
        print(url)
        response = await client.get(url)
        print(f"Fetching Current Day Weather")
        response.raise_for_status()
        return response.json()

# @app.get("/forecast_5_day/{lat}/{lon}/{city}")
# async def forecast_5_day(lat: float, lon: float, city: str):
#     forecast_data = await get_5_day_forecast(lat, lon)
#     # print(forecast_data)
#     data =  transform_5_day_forecast(forecast_data)
#     print(data)
#     return(data)

# @app.get("/forecast_5_day_day_night/{lat}/{lon}/{city}")
# async def forecast_5_day_day_night(lat: float, lon: float, city: str):
#     forecast_data = await get_5_day_forecast(lat, lon)
#     # print(forecast_data)
#     data =  transform_5_day_forecast_day_night(forecast_data)
#     print(data)
#     return(data)
# @app.get("/forecast_5_day_hourly/{lat}/{lon}/{city}")
# async def forecast_5_day_hourly(lat: float, lon: float, city: str):
#     forecast_data = await get_5_day_forecast(lat, lon)
#     # print(forecast_data)
#     data =  transform_5_day_forecast_hourly(forecast_data)
#     print(data)
#     return(data)

# @app.get("/current_day_weather/{lat}/{lon}/{city}")
# async def current_day_weather(lat: float, lon: float, city: str):
#     weather_data = await get_current_day_weather(lat, lon)
#     print(weather_data)
#     data = transform_current_day_weather(weather_data)
#     print(data)
#     return(data)

# @app.get("/aqi/{lat}/{lon}/{city}")
# async def aqi(lat: float, lon: float, city: str):
#     aqi_data = await get_aqi(lat, lon)
#     # print(aqi_data)
#     data = transform_aqi(aqi_data)
#     print(data)
#     return(data)
@app.get("/forecast_5_day/{lat}/{lon}/{city}")
async def forecast_5_day(lat: float, lon: float, city: str):
    cache_key = f"forecast_5_day:{city.lower()}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    forecast_data = await get_5_day_forecast(lat, lon)
    data = transform_5_day_forecast(forecast_data)
    await redis_client.setex(cache_key, 1800, json.dumps(data))  # 30 minutes
    return data

@app.get("/forecast_5_day_day_night/{lat}/{lon}/{city}")
async def forecast_5_day_day_night(lat: float, lon: float, city: str):
    cache_key = f"forecast_5_day_dn:{city.lower()}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    forecast_data = await get_5_day_forecast(lat, lon)
    data = transform_5_day_forecast_day_night(forecast_data)
    await redis_client.setex(cache_key, 1800, json.dumps(data))  # 30 minutes
    return data

@app.get("/forecast_5_day_hourly/{lat}/{lon}/{city}")
async def forecast_5_day_hourly(lat: float, lon: float, city: str):
    cache_key = f"forecast_5_day_hourly:{city.lower()}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    forecast_data = await get_5_day_forecast(lat, lon)
    data = transform_5_day_forecast_hourly(forecast_data)
    await redis_client.setex(cache_key, 1800, json.dumps(data))  # 30 minutes
    return data

@app.get("/current_day_weather/{lat}/{lon}/{city}")
async def current_day_weather(lat: float, lon: float, city: str):
    cache_key = f"current_day_weather:{city.lower()}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    weather_data = await get_current_day_weather(lat, lon)
    data = transform_current_day_weather(weather_data)
    await redis_client.setex(cache_key, 900, json.dumps(data))  # 15 minutes
    return data

@app.get("/aqi/{lat}/{lon}/{city}")
async def aqi(lat: float, lon: float, city: str):
    cache_key = f"aqi:{city.lower()}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    aqi_data = await get_aqi(lat, lon)
    data = transform_aqi(aqi_data)
    await redis_client.setex(cache_key, 900, json.dumps(data))  # 15 minutes
    return data