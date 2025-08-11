import { Image } from "react-native";

export const getWeatherIcon = (weather: string, styles: any, day: boolean = true) => {
    weather = weather ? weather.toLowerCase() : "";
    // day time icons
    if (day) {
        switch (weather) {
            case "clear sky":
                return <Image source={require('../assets/icons/SunSimple.png')} style={styles.icon} />;
            case "few clouds":
            case "scattered clouds":
            case "broken clouds":
                return <Image source={require('../assets/icons/SunSimpleCloud.png')} style={styles.icon} />;
            case "overcast clouds":
                return <Image source={require('../assets/icons/Overcast.png')} style={styles.icon} />;
            case "clouds":
                return <Image source={require('../assets/icons/Cloudy.png')} style={styles.icon} />;
            case "shower rain":
            case "heavy intensity rain":
            case "very heavy rain":
            case "extreme rain":
            case "shower rain and drizzle":
            case "heavy shower rain and drizzle":
            case "ragged shower rain":
                return <Image source={require('../assets/icons/ShowerRain.png')} style={styles.icon} />;
            case "light rain":
            case "light intensity drizzle":
            case "drizzle":
            case "light intensity drizzle rain":
            case "light shower rain":
                return <Image source={require('../assets/icons/LightRainDay.png')} style={styles.icon} />;
            case "rain":
            case "moderate rain":
            case "drizzle rain":
            case "freezing rain":
                return <Image source={require('../assets/icons/HeavyRain.png')} style={styles.icon} />;
            case "thunderstorm":
            case "thunderstorm with light rain":
            case "thunderstorm with rain":
            case "thunderstorm with heavy rain":
            case "thunderstorm with drizzle":
            case "thunderstorm with light drizzle":
            case "thunderstorm with heavy drizzle":
                return <Image source={require('../assets/icons/RainThunderStorm.png')} style={styles.icon} />;
            case "snow":
            case "light snow":
            case "heavy snow":
            case "sleet":
            case "shower sleet":
            case "light rain and snow":
            case "rain and snow":
            case "light shower snow":
            case "shower snow":
            case "heavy shower snow":
                return <Image source={require('../assets/icons/LightSnow.png')} style={styles.icon} />;
            case "mist":
            case "smoke":
            case "haze":
            case "fog":
            case "sand":
            case "dust":
            case "volcanic ash":
            case "squalls":
            case "tornado":
                return <Image source={require('../assets/icons/Mist.png')} style={styles.icon} />;
            default:
                return <Image source={require('../assets/icons/LoadingGlobe.png')} style={styles.icon} />;
        }
    }
    // night time icons
    switch (weather) {
        case "clear sky":
            return <Image source={require('../assets/icons/ClearMoon.png')} style={styles.icon} />;
        case "few clouds":
        case "scattered clouds":
            return <Image source={require('../assets/icons/CloudyMoonNight.png')} style={styles.icon} />;
        case "broken clouds":
        case "overcast clouds":
            return <Image source={require('../assets/icons/Overcast.png')} style={styles.icon} />;
        case "clouds":
            return <Image source={require('../assets/icons/Cloudy.png')} style={styles.icon} />;
        case "shower rain":
        case "heavy intensity rain":
        case "very heavy rain":
        case "extreme rain":
        case "shower rain and drizzle":
        case "heavy shower rain and drizzle":
        case "ragged shower rain":
            return <Image source={require('../assets/icons/ShowerRain.png')} style={styles.icon} />;
        case "light rain":
        case "light intensity drizzle":
        case "drizzle":
        case "light intensity drizzle rain":
        case "light shower rain":
            return <Image source={require('../assets/icons/LightRainNight.png')} style={styles.icon} />;
        case "rain":
        case "moderate rain":
        case "drizzle rain":
        case "freezing rain":
            return <Image source={require('../assets/icons/HeavyRain.png')} style={styles.icon} />;
        case "thunderstorm":
        case "thunderstorm with light rain":
        case "thunderstorm with rain":
        case "thunderstorm with heavy rain":
        case "thunderstorm with drizzle":
        case "thunderstorm with light drizzle":
        case "thunderstorm with heavy drizzle":
            return <Image source={require('../assets/icons/RainThunderStorm.png')} style={styles.icon} />;
        case "snow":
        case "light snow":
        case "heavy snow":
        case "sleet":
        case "shower sleet":
        case "light rain and snow":
        case "rain and snow":
        case "light shower snow":
        case "shower snow":
        case "heavy shower snow":
            return <Image source={require('../assets/icons/LightSnow.png')} style={styles.icon} />;
        case "mist":
        case "smoke":
        case "haze":
        case "fog":
        case "sand":
        case "dust":
        case "volcanic ash":
        case "squalls":
        case "tornado":
            return <Image source={require('../assets/icons/Mist.png')} style={styles.icon} />;
        default:
            return <Image source={require('../assets/icons/LoadingGlobe.png')} style={styles.icon} />;
    }
};


// export const getWeatherIcon = (weather: string, styles: any, day: boolean = true) => {
//     weather = weather? weather.toLowerCase() : "";
//     console.log(weather);
//         if(day){
//             switch(weather){
//                 case "clear sky":
//                     return <Image source={require('../assets/icons/SunSimple.png')} style={styles.icon} />
//                 case "few clouds":
//                     return <Image source={require('../assets/icons/SunSimpleCloud.png')} style={styles.icon} />
//                 case "clouds":
//                     return <Image source={require('../assets/icons/Cloudy.png')} style={styles.icon} />
//                 case "scattered clouds":
//                     return <Image source={require('../assets/icons/SunSimpleCloud.png')} style={styles.icon} />
//                 case "broken clouds":
//                     return <Image source={require('../assets/icons/SunSimpleCloud.png')} style={styles.icon} />
//                 case "overcast clouds":
//                     return <Image source={require('../assets/icons/Overcast.png')} style={styles.icon} />
//                 case "shower rain":
//                     return <Image source={require('../assets/icons/ShowerRain.png')} style={styles.icon} />
//                 case "light rain":
//                     return <Image source={require('../assets/icons/LightRainDay.png')} style={styles.icon} />
//                 case "rain":
//                     return <Image source={require('../assets/icons/HeavyRain.png')} style={styles.icon} />
//                 case "thunderstorm":
//                     return <Image source={require('../assets/icons/RainThunderStorm.png')} style={styles.icon} />
//                 case "snow":
//                     return <Image source={require('../assets/icons/LightSnow.png')} style={styles.icon} />
//                 case "mist":
//                     return <Image source={require('../assets/icons/Mist.png')} style={styles.icon} />
//                 default:
//                     return <Image source={require('../assets/icons/LoadingGlobe.png')} style={styles.icon} />
//             }
//         }
//         switch(weather){
//             case "clear sky":
//                 return <Image source={require('../assets/icons/ClearMoon.png')} style={styles.icon} />
//             case "few clouds":
//                 return <Image source={require('../assets/icons/CloudyMoonNight.png')} style={styles.icon} />
//             case "clouds":
//                 return <Image source={require('../assets/icons/Cloudy.png')} style={styles.icon} />
//             case "scattered clouds":
//                 return <Image source={require('../assets/icons/SunSimpleCloud.png')} style={styles.icon} />
//             case "broken clouds":
//                 return <Image source={require('../assets/icons/Overcast.png')} style={styles.icon} />
//             case "shower rain":
//                 return <Image source={require('../assets/icons/ShowerRain.png')} style={styles.icon} />
//             case "light rain":
//                     return <Image source={require('../assets/icons/LightRainNight.png')} style={styles.icon} />
//             case "rain":
//                 return <Image source={require('../assets/icons/HeavyRain.png')} style={styles.icon} />
//             case "thunderstorm":
//                 return <Image source={require('../assets/icons/RainThunderStorm.png')} style={styles.icon} />
//             case "snow":
//                 return <Image source={require('../assets/icons/LightSnow.png')} style={styles.icon} />
//             case "mist":
//                 return <Image source={require('../assets/icons/Mist.png')} style={styles.icon} />
//             default:
//                 return <Image source={require('../assets/icons/LoadingGlobe.png')} style={styles.icon} />
//         }
//     };