import { WeatherData, DailyForecast } from "../types";

const apiKey = (import.meta.env?.VITE_WEATHER_API_KEY as string) || '';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Map WeatherAPI condition codes to our icon types
const mapConditionToIcon = (code: number, isDay: number): 'sun' | 'cloud' | 'rain' | 'storm' | 'snow' => {
    // Sunny/Clear
    if (code === 1000) return isDay ? 'sun' : 'sun';

    // Cloudy conditions
    if ([1003, 1006, 1009, 1030, 1135, 1147].includes(code)) return 'cloud';

    // Rain conditions
    if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) return 'rain';

    // Storm/Thunder conditions
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'storm';

    // Snow conditions
    if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return 'snow';

    return 'cloud';
};

// Generate a witty description based on weather
const generateDescription = (condition: string, temp: number): string => {
    const descriptions: { [key: string]: string[] } = {
        sun: [
            "Perfect weather for interstellar exploration.",
            "Solar radiation levels optimal for outdoor activities.",
            "Clear skies across the planetary surface.",
            "Excellent visibility for celestial observations.",
        ],
        cloud: [
            "Atmospheric density increasing. Clouds gathering.",
            "Nebula-like formations detected in atmosphere.",
            "Cloud cover obscuring stellar visibility.",
            "Overcast conditions prevail across sectors.",
        ],
        rain: [
            "Liquid precipitation incoming. Seek shelter.",
            "Atmospheric moisture reaching critical levels.",
            "Rain protocol activated. Umbrella recommended.",
            "Water particles descending from cloud formations.",
        ],
        storm: [
            "Electromagnetic disturbance detected. Stay alert.",
            "Storm system approaching. Batten the hatches.",
            "Severe weather advisory in effect.",
            "Thunder protocols engaged.",
        ],
        snow: [
            "Frozen precipitation imminent. Bundle up.",
            "Ice crystals forming in upper atmosphere.",
            "Winter conditions detected. Deploy thermal gear.",
            "Snowfall probability at maximum.",
        ],
    };

    const conditionDescriptions = descriptions[condition] || descriptions.cloud;
    return conditionDescriptions[Math.floor(Math.random() * conditionDescriptions.length)];
};

export const getRealtimeWeather = async (city: string): Promise<WeatherData | null> => {
    if (!apiKey) {
        console.error("Weather API Key missing");
        return null;
    }

    try {
        // Get current weather + 5 day forecast in one call
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5&aqi=no`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        // Map the response to our WeatherData format
        const current = data.current;
        const location = data.location;
        const forecastDays = data.forecast.forecastday;

        const condition = mapConditionToIcon(current.condition.code, current.is_day);

        const forecast: DailyForecast[] = forecastDays.map((day: any) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            return {
                day: dayName,
                temp: Math.round(day.day.avgtemp_c),
                icon: mapConditionToIcon(day.day.condition.code, 1),
            };
        });

        const weatherData: WeatherData = {
            city: `${location.name}, ${location.country}`,
            temp: Math.round(current.temp_c),
            condition: condition,
            high: Math.round(forecastDays[0].day.maxtemp_c),
            low: Math.round(forecastDays[0].day.mintemp_c),
            humidity: current.humidity,
            windSpeed: Math.round(current.wind_kph),
            description: generateDescription(condition, current.temp_c),
            forecast: forecast,
        };

        return weatherData;

    } catch (error) {
        console.error("Weather Fetch Error:", error);
        return null;
    }
};
